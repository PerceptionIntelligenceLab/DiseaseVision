import { useState, useRef, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FiUploadCloud, FiArrowLeft, FiX, FiDownload } from 'react-icons/fi'
import type { MainLayoutOutletContext } from '../site/mainLayoutContext'
import { generateReport } from './generateReport'
import './ModelPage.css'

const API_URL = 'https://harshithreddy01-dentimap.hf.space/api/v1/inference/predict'
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

const SAMPLE_IMAGES = [
  `${BASE}/test-images/dentimap/DentalX-ray.png`,
  `${BASE}/test-images/dentimap/dental2.png`,
  `${BASE}/test-images/dentimap/dental3.png`,
  `${BASE}/test-images/dentimap/dental4.png`,
  `${BASE}/test-images/dentimap/dental5.png`,
]

export default function DentimapPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
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
      const name = url.split('/').pop() ?? 'sample.png'
      loadFile(new File([blob], name, { type: blob.type || 'image/png' }))
    } catch {
      setError('Could not load sample image.')
    }
  }

  const handleDetect = async () => {
    if (!file || !consent) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(API_URL, { method: 'POST', body: form })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const blob = await res.blob()
      setResult(URL.createObjectURL(blob))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => {
    if (result) URL.revokeObjectURL(result)
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

  return (
    <div className={`model-page${isDark ? '' : ' light'}`}>
      <Link to="/services" className="model-back-btn">
        <FiArrowLeft size={14} />
        Back to Services
      </Link>

      <div className="model-header">
        <h1>DentiMap</h1>
        <div className="model-header-line" />
        <p>
          Upload a dental panoramic X-ray to detect and map teeth, identify anomalies, and receive
          a structured diagnostic overlay.
        </p>
      </div>

      <div className="sample-chips-row">
        <span className="sample-chips-label">Try a sample X-ray:</span>
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
            <li>Upload a dental panoramic X-ray (JPEG or PNG).</li>
            <li>The model detects teeth positions and identifies anomalies.</li>
            <li>An annotated image is returned with diagnostic overlays.</li>
            <li>Results appear beside your original X-ray for comparison.</li>
          </ul>
        </div>
        <div className="panel-card">
          <h3>Guidelines</h3>
          <ul>
            <li>Use full panoramic X-rays. Cropped or periapical views may reduce accuracy.</li>
            <li>Higher resolution images yield more detailed annotations.</li>
            <li>Ensure the image is properly oriented (standard panoramic view).</li>
            <li>The model performs best on adult dentition images.</li>
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
          <span className="drop-sub">JPEG, PNG — panoramic dental X-rays work best</span>
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
                <img src={preview} alt="Input X-ray" />
              </div>
            </div>
            {result && (
              <div className="preview-col">
                <span className="preview-label">Analysis Result</span>
                <div className="preview-box">
                  <img src={result} alt="DentiMap output" />
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
          id="dentimap-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <label htmlFor="dentimap-consent">
          I confirm this image is de-identified and contains no personal health information.
          I understand results are for research purposes only and not a clinical diagnosis.
        </label>
      </div>

      <div className="model-actions">
        <button
          className="btn-detect"
          onClick={handleDetect}
          disabled={!file || !consent || loading}
        >
          {loading ? <><span className="spinner" /> Analyzing…</> : 'Analyze X-ray'}
        </button>
        {result && preview && (
          <button
            className="btn-pdf"
            disabled={pdfLoading}
            onClick={async () => {
              setPdfLoading(true)
              await generateReport({
                modelName: 'DentiMap',
                originalSrc: preview,
                resultSrc: result,
                originalLabel: 'Original X-ray',
                resultLabel: 'Analysis Result',
              })
              setPdfLoading(false)
            }}
          >
            {pdfLoading ? <><span className="spinner spinner-dark" /> Generating…</> : <><FiDownload size={14} /> Download PDF</>}
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
        professional clinical judgment. Always consult a qualified dentist or oral radiologist
        for diagnosis and treatment decisions.
      </div>
    </div>
  )
}
