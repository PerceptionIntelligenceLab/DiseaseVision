import { useState, useRef, useCallback } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FiUploadCloud, FiArrowLeft, FiX, FiDownload } from 'react-icons/fi'
import type { MainLayoutOutletContext } from '../site/mainLayoutContext'
import { generateReport } from './generateReport'
import './ModelPage.css'

const API_URL = 'https://harshithreddy01-polyp-detection.hf.space/predict?model=Kvasir-Seg'
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

const SAMPLE_IMAGES = [
  `${BASE}/test-images/polyp/cju1b0y2e396p08558ois175d.jpg`,
  `${BASE}/test-images/polyp/cju1b3zgj3d8e0801kpolea6c.jpg`,
  `${BASE}/test-images/polyp/cju1b75x63ddl0799sdp0i2j3.jpg`,
  `${BASE}/test-images/polyp/cju1bhnfitmge0835ynls0l6b.jpg`,
  `${BASE}/test-images/polyp/cju1bm8063nmh07996rsjjemq.jpg`,
  `${BASE}/test-images/polyp/cju1brhsj3rls0855a1vgdlen.jpg`,
]

interface PolypResult {
  mask: string
  overlay: string
}

function buildOverlay(originalDataUrl: string, maskDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const origImg = new Image()
    const maskImg = new Image()
    let loaded = 0

    const onLoad = () => {
      if (++loaded < 2) return

      const w = origImg.naturalWidth
      const h = origImg.naturalHeight

      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = w
      maskCanvas.height = h
      const mCtx = maskCanvas.getContext('2d')!
      mCtx.drawImage(maskImg, 0, 0, w, h)
      const maskData = mCtx.getImageData(0, 0, w, h)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(origImg, 0, 0, w, h)

      const tintCanvas = document.createElement('canvas')
      tintCanvas.width = w
      tintCanvas.height = h
      const tCtx = tintCanvas.getContext('2d')!
      const tintData = tCtx.createImageData(w, h)
      for (let i = 0; i < maskData.data.length; i += 4) {
        const brightness = maskData.data[i]
        if (brightness > 128) {
          tintData.data[i] = 255
          tintData.data[i + 1] = 60
          tintData.data[i + 2] = 0
          tintData.data[i + 3] = 170
        }
      }
      tCtx.putImageData(tintData, 0, 0)

      ctx.drawImage(tintCanvas, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }

    origImg.onload = onLoad
    maskImg.onload = onLoad
    origImg.onerror = reject
    maskImg.onerror = reject
    origImg.src = originalDataUrl
    maskImg.src = maskDataUrl
  })
}

export default function PolypDetectionPage() {
  const { theme } = useOutletContext<MainLayoutOutletContext>()
  const isDark = theme === 'black'

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<PolypResult | null>(null)
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
      const data = await res.json()
      if (!data.mask) throw new Error('No mask returned from server.')
      const maskSrc = `data:image/png;base64,${data.mask}`
      const overlaySrc = preview ? await buildOverlay(preview, maskSrc) : maskSrc
      setResult({ mask: maskSrc, overlay: overlaySrc })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed. Please try again.')
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

  const pdfResultSrc = result?.overlay ?? null

  return (
    <div className={`model-page${isDark ? '' : ' light'}`}>
      <Link to="/services" className="model-back-btn">
        <FiArrowLeft size={14} />
        Back to Services
      </Link>

      <div className="model-header">
        <h1>Polyp Detection</h1>
        <div className="model-header-line" />
        <p>
          Upload a colonoscopy image to run our polyp segmentation model. Returns a binary mask
          and a colored overlay highlighting the detected polyp region.
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
            <li>Upload a colonoscopy frame (JPEG or PNG).</li>
            <li>Model runs pixel-level segmentation using the Kvasir-Seg checkpoint.</li>
            <li>A binary mask and colored overlay are returned.</li>
            <li>All three views appear side by side for comparison.</li>
          </ul>
        </div>
        <div className="panel-card">
          <h3>Guidelines</h3>
          <ul>
            <li>Use clear, well-lit colonoscopy images for best results.</li>
            <li>Avoid heavily compressed or very low-resolution frames.</li>
            <li>The model was trained on the Kvasir-SEG and CVC-ClinicDB datasets.</li>
            <li>Small or flat polyps may have lower detection confidence.</li>
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
          <span className="drop-sub">JPEG, PNG — colonoscopy frames work best</span>
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
          <div className={result ? 'preview-row preview-row-3' : 'preview-row'}>
            <div className="preview-col">
              <span className="preview-label">Original</span>
              <div className="preview-box">
                <img src={preview} alt="Input" />
              </div>
            </div>
            {result && (
              <div className="preview-col">
                <span className="preview-label">Binary Mask</span>
                <div className="preview-box">
                  <img src={result.mask} alt="Binary mask" />
                </div>
              </div>
            )}
            {result && (
              <div className="preview-col">
                <span className="preview-label">Polyp Overlay</span>
                <div className="preview-box">
                  <img src={result.overlay} alt="Polyp overlay" />
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
          id="polyp-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <label htmlFor="polyp-consent">
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
          {loading ? <><span className="spinner" /> Detecting…</> : 'Detect Polyp'}
        </button>
        {result && preview && pdfResultSrc && (
          <button
            className="btn-pdf"
            disabled={pdfLoading}
            onClick={async () => {
              setPdfLoading(true)
              await generateReport({
                modelName: 'Polyp Detection',
                originalSrc: preview,
                resultSrc: pdfResultSrc,
                originalLabel: 'Original Image',
                resultLabel: result.overlay ? 'Polyp Overlay' : 'Segmentation Mask',
              })
              setPdfLoading(false)
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
        professional clinical judgment. Always consult a qualified healthcare provider for
        diagnosis and treatment decisions.
      </div>
    </div>
  )
}
