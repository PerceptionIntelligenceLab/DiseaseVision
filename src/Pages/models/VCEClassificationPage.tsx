import { useState, useRef, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FiUploadCloud, FiArrowLeft, FiX, FiDownload } from 'react-icons/fi'
import type { MainLayoutOutletContext } from '../site/mainLayoutContext'
import { generateReport } from './generateReport'
import './ModelPage.css'

const API_URL = 'https://harshithreddy01-endoscopy.hf.space/api/v1/predict'
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

const SAMPLE_IMAGES = [
  `${BASE}/test-images/vce/sample1.jpg`,
  `${BASE}/test-images/vce/sample2.jpg`,
  `${BASE}/test-images/vce/sample3.jpg`,
  `${BASE}/test-images/vce/sample4.jpg`,
  `${BASE}/test-images/vce/sample5.jpg`,
]

const CLASS_NAMES: string[] = [
  'ampulla_of_vater',
  'angiectasia',
  'blood_fresh',
  'blood_hematin',
  'erosion',
  'erythema',
  'foreign_body',
  'ileocecal_valve',
  'lymphangiectasia',
  'normal_clean_mucosa',
  'pylorus',
  'reduced_mucosal_view',
  'ulcer',
]

const DISPLAY_NAMES: Record<string, string> = {
  ampulla_of_vater: 'Ampulla of Vater',
  angiectasia: 'Angiectasia',
  blood_fresh: 'Fresh Blood',
  blood_hematin: 'Blood (Hematin)',
  erosion: 'Erosion',
  erythema: 'Erythema',
  foreign_body: 'Foreign Body',
  ileocecal_valve: 'Ileocecal Valve',
  lymphangiectasia: 'Lymphangiectasia',
  normal_clean_mucosa: 'Normal Clean Mucosa',
  pylorus: 'Pylorus',
  reduced_mucosal_view: 'Reduced Mucosal View',
  ulcer: 'Ulcer',
}

interface ClassificationResult {
  class_id: number
  class_name: string
  confidence: number
  probabilities: number[]
}

function formatClassName(name: string): string {
  return DISPLAY_NAMES[name] ?? name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function getConfidenceColor(conf: number): string {
  if (conf >= 0.8) return '#22c55e'
  if (conf >= 0.5) return '#eab308'
  return '#ef4444'
}

function buildResultCanvas(
  originalDataUrl: string,
  result: ClassificationResult,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const w = Math.max(img.naturalWidth, 500)
      const h = img.naturalHeight
      const panelW = 360
      const totalW = w + panelW
      const canvas = document.createElement('canvas')
      canvas.width = totalW
      canvas.height = Math.max(h, 400)
      const ctx = canvas.getContext('2d')!

      ctx.fillStyle = '#0b1220'
      ctx.fillRect(0, 0, totalW, canvas.height)
      ctx.drawImage(img, 0, 0, w, h)

      ctx.fillStyle = '#111827'
      ctx.fillRect(w, 0, panelW, canvas.height)

      ctx.font = 'bold 14px sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('CLASSIFICATION RESULT', w + 20, 30)

      ctx.font = 'bold 20px sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(formatClassName(result.class_name), w + 20, 60)

      const confPct = (result.confidence * 100).toFixed(1)
      ctx.font = 'bold 28px sans-serif'
      ctx.fillStyle = getConfidenceColor(result.confidence)
      ctx.fillText(`${confPct}%`, w + 20, 100)

      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText('CONFIDENCE', w + 20, 116)

      const top = result.probabilities
        .map((p, i) => ({ name: CLASS_NAMES[i], prob: p }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 5)

      let y = 145
      ctx.font = 'bold 12px sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('TOP PREDICTIONS', w + 20, y)
      y += 18

      top.forEach(({ name, prob }) => {
        ctx.font = '12px sans-serif'
        ctx.fillStyle = '#cbd5e1'
        ctx.fillText(formatClassName(name), w + 20, y)

        const barW = 200
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(w + 20, y + 5, barW, 10)
        ctx.fillStyle = '#3b82f6'
        ctx.fillRect(w + 20, y + 5, barW * prob, 10)

        ctx.fillStyle = '#94a3b8'
        ctx.font = '11px sans-serif'
        ctx.fillText(`${(prob * 100).toFixed(1)}%`, w + 20 + barW + 8, y + 14)

        y += 38
      })

      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.onerror = reject
    img.src = originalDataUrl
  })
}

export default function VCEClassificationPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const loadFile = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped && dropped.type.startsWith('image/')) loadFile(dropped)
    },
    [loadFile],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (picked) loadFile(picked)
  }

  const loadSample = async (url: string) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const name = url.split('/').pop() ?? 'sample.jpg'
      loadFile(new File([blob], name, { type: blob.type || 'image/jpeg' }))
    } catch {
      setError('Could not load sample image.')
    }
  }

  const handleClassify = async () => {
    if (!file || !consent) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(API_URL, { method: 'POST', body: form })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data: ClassificationResult = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Classification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleReset = () => {
    clearImage()
    setConsent(false)
  }

  const topPredictions = result
    ? result.probabilities
        .map((p, i) => ({ name: CLASS_NAMES[i], prob: p }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 5)
    : []

  return (
    <div className={`model-page${isDark ? '' : ' light'}`}>
      <Link to="/services" className="model-back-btn">
        <FiArrowLeft size={14} />
        Back to Services
      </Link>

      <div className="model-header">
        <h1>VCE Classification</h1>
        <div className="model-header-line" />
        <p>
          Upload a capsule endoscopy frame to classify GI tract findings. The model identifies
          13 conditions across the Kvasir-Capsule taxonomy with confidence scores and a full
          probability distribution.
        </p>
      </div>

      <div className="sample-chips-row">
        <span className="sample-chips-label">Try a sample:</span>
        {SAMPLE_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            className="sample-chip"
            onClick={() => loadSample(src)}
          >
            Sample {i + 1}
          </button>
        ))}
      </div>

      <div className="model-info-row">
        <div className="panel-card">
          <h3>How it works</h3>
          <ul>
            <li>Upload a capsule endoscopy frame (JPEG, PNG, or WebP).</li>
            <li>A DINOv2-based dual-stream classifier processes global and local features.</li>
            <li>The predicted class, confidence score, and full probability distribution are returned.</li>
            <li>Top predictions are displayed with visual confidence bars.</li>
          </ul>
        </div>
        <div className="panel-card">
          <h3>Guidelines</h3>
          <ul>
            <li>Use individual capsule endoscopy frames for best results.</li>
            <li>Avoid heavily compressed or very low-resolution images.</li>
            <li>The model was trained on the Kvasir-Capsule dataset (13 classes).</li>
            <li>Multiple findings in one frame may reduce classification certainty.</li>
          </ul>
        </div>
      </div>

      {!preview ? (
        <div
          className={`drop-zone${dragOver ? ' drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <FiUploadCloud className="drop-icon" />
          <span className="drop-label">Drop image here or click to upload</span>
          <span className="drop-sub">JPEG, PNG, WebP — capsule endoscopy frames work best</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="preview-area">
          <div className={result ? 'preview-row' : 'preview-row preview-single'}>
            <div className="preview-col">
              <span className="preview-label">Original</span>
              <div className="preview-box">
                <img src={preview} alt="Input frame" />
              </div>
            </div>
            {result && (
              <div className="preview-col">
                <span className="preview-label">Classification Result</span>
                <div className="vce-result-panel">
                  <div className="vce-prediction-main">
                    <span className="vce-predicted-label">Predicted Class</span>
                    <span className="vce-predicted-class">
                      {formatClassName(result.class_name)}
                    </span>
                    <div className="vce-confidence-row">
                      <span
                        className="vce-confidence-value"
                        style={{ color: getConfidenceColor(result.confidence) }}
                      >
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                      <span className="vce-confidence-label">confidence</span>
                    </div>
                    <div className="vce-confidence-bar-track">
                      <div
                        className="vce-confidence-bar-fill"
                        style={{
                          width: `${result.confidence * 100}%`,
                          background: getConfidenceColor(result.confidence),
                        }}
                      />
                    </div>
                  </div>

                  <div className="vce-top-predictions">
                    <span className="vce-section-title">Top Predictions</span>
                    {topPredictions.map(({ name, prob }) => (
                      <div key={name} className="vce-prob-row">
                        <div className="vce-prob-header">
                          <span className="vce-prob-name">{formatClassName(name)}</span>
                          <span className="vce-prob-pct">{(prob * 100).toFixed(1)}%</span>
                        </div>
                        <div className="vce-prob-bar-track">
                          <div
                            className="vce-prob-bar-fill"
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button type="button" className="change-image-btn" onClick={clearImage}>
            <FiX size={13} /> Change image
          </button>
        </div>
      )}

      <div className="consent-row">
        <input
          type="checkbox"
          id="vce-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <label htmlFor="vce-consent">
          I confirm this image is de-identified and contains no personal health information.
          I understand results are for research purposes only and not a clinical diagnosis.
        </label>
      </div>

      <div className="model-actions">
        <button
          className="btn-detect"
          onClick={handleClassify}
          disabled={!file || !consent || loading}
        >
          {loading ? <><span className="spinner" /> Classifying…</> : 'Classify Image'}
        </button>
        {result && preview && (
          <button
            className="btn-pdf"
            disabled={pdfLoading}
            onClick={async () => {
              setPdfLoading(true)
              try {
                const resultImg = await buildResultCanvas(preview, result)
                await generateReport({
                  modelName: 'VCE Classification',
                  originalSrc: preview,
                  resultSrc: resultImg,
                  originalLabel: 'Original Frame',
                  resultLabel: 'Classification Result',
                })
              } finally {
                setPdfLoading(false)
              }
            }}
          >
            {pdfLoading
              ? <><span className="spinner spinner-dark" /> Generating…</>
              : <><FiDownload size={14} /> Download PDF</>}
          </button>
        )}
        <button className="btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {error && <div className="model-error">{error}</div>}

      <div className="model-disclaimer">
        <strong>Medical Disclaimer:</strong> This tool is intended for research and educational
        purposes only. It is not a certified medical device and must not be used to replace
        professional clinical judgment. Always consult a qualified gastroenterologist for
        diagnosis and treatment decisions.
      </div>
    </div>
  )
}
