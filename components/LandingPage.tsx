'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [previewName, setPreviewName] = useState('');

  return (
    <div className="landing">
      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <Link href="/" className="lp-nav-brand">
          <img src="/icon.png" alt="Motion-U" className="lp-nav-logo" />
          <span className="lp-nav-name">Motion-U</span>
        </Link>
        <Link href="/cert" className="lp-nav-link">
          Generator
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-eyebrow">
          <span className="lp-line" />
          Bulk Certificate Generator
          <span className="lp-line" />
        </div>
        <h1 className="lp-hero-title">
          Certif<span className="lp-hero-accent">y</span>
        </h1>
        <p className="lp-hero-sub">
          Upload a CSV of names and a PNG template. Configure text placement,
          font, and color — then download a ZIP of every personalized certificate.
        </p>
        <Link href="/cert" className="lp-cta">
          Start Generating
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </section>

      {/* ── Interactive Preview ──────────────────────────────── */}
      <section className="lp-preview">
        <h2 className="lp-section-title">See It In Action</h2>
        <p className="lp-section-desc">
          Type a name below and watch it appear on a live certificate preview.
        </p>

        <div className="lp-preview-layout">
          <div className="lp-preview-controls">
            <label className="lp-preview-label" htmlFor="preview-name">
              Enter a name
            </label>
            <input
              id="preview-name"
              type="text"
              className="lp-preview-input"
              placeholder="e.g. Amirul Haziq"
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
              autoComplete="off"
            />
            <p className="lp-preview-hint">
              The generator uses the same font, color, and positioning for
              every name in your CSV.
            </p>
          </div>

          <div className="lp-certificate">
            <div className="lp-cert-border">
              <div className="lp-cert-inner">
                <div className="lp-cert-icon">✦</div>
                <div className="lp-cert-heading">Certificate of Achievement</div>
                <div className="lp-cert-sub">This certifies that</div>
                <div className={`lp-cert-name ${previewName ? 'lp-cert-name--filled' : ''}`}>
                  {previewName || 'Your Name Here'}
                </div>
                <div className="lp-cert-body">
                  has successfully completed the certification program
                </div>
                <div className="lp-cert-footer">
                  <div className="lp-cert-seal" />
                  <div className="lp-cert-date">2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="lp-steps">
        <h2 className="lp-section-title">How It Works</h2>
        <p className="lp-section-desc">
          Three simple steps to generate certificates for everyone on your list.
        </p>

        <div className="lp-steps-grid">
          <div className="lp-step-card">
            <div className="lp-step-num">01</div>
            <div className="lp-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="lp-step-title">Upload a CSV</h3>
            <p className="lp-step-desc">
              Drop your recipients CSV file. The first column should contain
              the names to appear on each certificate.
            </p>
          </div>

          <div className="lp-step-card">
            <div className="lp-step-num">02</div>
            <div className="lp-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h3 className="lp-step-title">Upload a Template</h3>
            <p className="lp-step-desc">
              Drop your PNG certificate background and configure where names
              should be placed (X/Y, font size, color, font family).
            </p>
          </div>

          <div className="lp-step-card">
            <div className="lp-step-num">03</div>
            <div className="lp-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3 className="lp-step-title">Generate &amp; Download</h3>
            <p className="lp-step-desc">
              Click generate and your browser will download a ZIP file
              containing every personalized certificate ready to share.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="lp-features">
        <h2 className="lp-section-title">Everything You Need</h2>
        <div className="lp-features-grid">
          <div className="lp-feature">
            <div className="lp-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h4 className="lp-feature-title">Bulk Generation</h4>
            <p className="lp-feature-desc">
              Generate hundreds of certificates at once from a single CSV file.
            </p>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <h4 className="lp-feature-title">Custom Positioning</h4>
            <p className="lp-feature-desc">
              Precise X/Y coordinate control over text placement on your template.
            </p>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h4 className="lp-feature-title">Font &amp; Color Control</h4>
            <p className="lp-feature-desc">
              Choose from multiple fonts and pick any color to match your brand.
            </p>
          </div>
          <div className="lp-feature">
            <div className="lp-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h4 className="lp-feature-title">Cloudinary Powered</h4>
            <p className="lp-feature-desc">
              Templates are securely stored and optimized via Cloudinary CDN.
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <h2 className="lp-cta-title">Ready to Create Certificates?</h2>
        <p className="lp-cta-desc">
          Upload your first CSV and template — it takes less than a minute.
        </p>
        <Link href="/cert" className="lp-cta">
          Get Started Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <img src="/icon.png" alt="Motion-U" className="lp-footer-logo" />
          <span className="lp-footer-powered">Powered by <strong>Motion-U</strong></span>
        </div>
        <p className="lp-footnote">
          Develop and Maintain by Kaiden-A
        </p>
      </footer>
    </div>
  );
}
