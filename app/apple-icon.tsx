import { ImageResponse } from "next/og"

export const size        = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          "100%",
          height:         "100%",
          background:     "#0B0B0C",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          borderRadius:   "28px",
        }}
      >
        <span
          style={{
            color:      "#C9A227",
            fontSize:   126,
            fontWeight: 700,
            fontFamily: "Georgia, 'Times New Roman', serif",
            lineHeight: 1,
            marginTop:  "4px",
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size }
  )
}
