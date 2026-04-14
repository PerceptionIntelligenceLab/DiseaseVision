import { jsPDF } from 'jspdf'

interface ReportOptions {
  modelName: string
  originalSrc: string
  resultSrc: string
  originalLabel: string
  resultLabel: string
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function imgToDataURL(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.92)
}

export async function generateReport(opts: ReportOptions): Promise<void> {
  const { modelName, originalSrc, resultSrc, originalLabel, resultLabel } = opts

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 18
  const contentW = W - margin * 2
  let y = margin

  doc.setFillColor(11, 18, 32)
  doc.rect(0, 0, W, 28, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(0, 191, 255)
  doc.text('DiseaseVision', margin, 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text('PerceptionIntelligenceLab', margin, 20)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text(`${modelName} — Diagnostic Report`, W - margin, 16, { align: 'right' })

  y = 36

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text(`Generated: ${dateStr} at ${timeStr}`, margin, y)
  doc.text('Status: Research Use Only', W - margin, y, { align: 'right' })
  y += 8

  doc.setDrawColor(59, 130, 246)
  doc.setLineWidth(0.4)
  doc.line(margin, y, W - margin, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text(modelName, margin, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(71, 85, 105)
  doc.text(
    'AI-assisted analysis performed by PerceptionIntelligenceLab deep learning model.',
    margin, y,
  )
  y += 10

  const imgW = (contentW - 8) / 2
  const imgH = imgW * 0.75

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text(originalLabel.toUpperCase(), margin, y)
  doc.text(resultLabel.toUpperCase(), margin + imgW + 8, y)
  y += 4

  try {
    const origImg = await loadImage(originalSrc)
    const origData = imgToDataURL(origImg)
    doc.addImage(origData, 'JPEG', margin, y, imgW, imgH)
  } catch {
    doc.setFillColor(241, 245, 249)
    doc.rect(margin, y, imgW, imgH, 'F')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Image unavailable', margin + imgW / 2, y + imgH / 2, { align: 'center' })
  }

  try {
    const resImg = await loadImage(resultSrc)
    const resData = imgToDataURL(resImg)
    doc.addImage(resData, 'JPEG', margin + imgW + 8, y, imgW, imgH)
  } catch {
    doc.setFillColor(241, 245, 249)
    doc.rect(margin + imgW + 8, y, imgW, imgH, 'F')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Image unavailable', margin + imgW + 8 + imgW / 2, y + imgH / 2, { align: 'center' })
  }

  y += imgH + 10

  doc.setFillColor(239, 246, 255)
  doc.setDrawColor(147, 197, 253)
  doc.setLineWidth(0.3)
  doc.roundedRect(margin, y, contentW, 24, 3, 3, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(37, 99, 235)
  doc.text('Future Direction', margin + 5, y + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text(
    'A comprehensive clinical report with structured findings, confidence scores, and',
    margin + 5, y + 13,
  )
  doc.text(
    'differential analysis is currently in development and will be released shortly.',
    margin + 5, y + 19,
  )
  y += 30

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(15, 23, 42)
  doc.text('Research Team — PerceptionIntelligenceLab', margin, y)
  y += 5

  const members = [
    'Dr. Debesh Jha',
    'Harshith Reddy Nalla',
    'Swarna Sai Sankar',
  ]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  members.forEach((m) => {
    doc.text(`› ${m}`, margin + 3, y)
    y += 5
  })
  y += 3

  doc.setFillColor(254, 242, 242)
  doc.setDrawColor(252, 165, 165)
  doc.setLineWidth(0.3)
  doc.roundedRect(margin, y, contentW, 20, 3, 3, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(185, 28, 28)
  doc.text('Medical Disclaimer', margin + 5, y + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(153, 27, 27)
  doc.text(
    'This report is for research and educational purposes only. It is not a certified medical',
    margin + 5, y + 12,
  )
  doc.text(
    'device output and must not replace professional clinical judgment.',
    margin + 5, y + 17,
  )

  const pageH = 297
  doc.setFillColor(11, 18, 32)
  doc.rect(0, pageH - 12, W, 12, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text('DiseaseVision by PerceptionIntelligenceLab', margin, pageH - 5)
  doc.text('diseasevision.ai', W - margin, pageH - 5, { align: 'right' })

  const filename = `${modelName.replace(/\s+/g, '_')}_Report_${Date.now()}.pdf`
  doc.save(filename)
}
