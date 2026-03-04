"use client"

export default function Footer() {

  const linkStyle: React.CSSProperties = {
    display: "block",
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    opacity: 0.85,
    marginBottom: "8px"
  }

  return (
    <footer
      style={{
        background: "#050505",
        color: "white",
        marginTop: "120px",
        borderTop: "1px solid rgba(212,175,55,0.3)"
      }}
    >

      <div
        style={{
          height: "2px",
          background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
          marginBottom: "40px"
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "60px 20px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: "40px"
        }}
      >

        {/* Logo Section */}
        <div>
          <img
            src="/images/logo_white_text.png"
            style={{ width: "240px", marginBottom: "20px" }}
          />
          <p style={{ fontSize: "13px", opacity: 0.7, lineHeight: "1.6" }}>
            Academic publishing with cultural responsibility,
            global distribution, and institutional standards.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={{ marginBottom: "14px" }}>Navigation</h4>
          <a href="/about" style={linkStyle}>About</a>
          <a href="/model" style={linkStyle}>Publishing Model</a>
          <a href="/services" style={linkStyle}>Services</a>
          <a href="/media" style={linkStyle}>Media</a>
          <a href="/partnership" style={linkStyle}>Partnerships</a>
          <a href="/board_of_advisors" style={linkStyle}>Board of Advisors</a>
          <a href="/submissions" style={linkStyle}>Submit</a>
          <a href="/support" style={linkStyle}>Support / Contribute</a>
        </div>

        {/* Policies */}
        <div>
          <h4 style={{ marginBottom: "14px" }}>Policies</h4>
          <a href="/policies" style={linkStyle}>Policies & Compliance</a>
        </div>

      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "20px",
          textAlign: "center",
          fontSize: "12px",
          opacity: 0.7
        }}
      >
        © 2026 Sankofa Publishers. All rights reserved.
      </div>

    </footer>
  )
}