import { ImageResponse } from "next/og"

export const size        = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
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
          borderRadius:   "5px",
        }}
      >
        <span
          style={{
            color:      "#C9A227",
            fontSize:   22,
            fontWeight: 700,
            fontFamily: "Georgia, 'Times New Roman', serif",
            lineHeight: 1,
            marginTop:  "1px",
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size }
  )
}
