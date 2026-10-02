import { memo, useId } from "react";
function Machine({ level }: { level: number }) {
  const machineLevel = level + 1;
  const uid = useId();
  const portal = uid + "portal",
    clip = uid + "clip";
  return (
    <svg
      className="machine-art"
      viewBox="0 0 520 410"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <defs>
        <radialGradient id={portal}>
          <stop stopColor="#efffd4" />
          <stop offset=".25" stopColor="#a8ffe0" />
          <stop offset=".6" stopColor="#40bda8" />
          <stop offset="1" stopColor="#12334f" />
        </radialGradient>
        <clipPath id={clip}>
          <path d="M203 278V146h16v-20h82v20h16v132z" />
        </clipPath>
      </defs>
      <g className="scene-distant" fill="#214347">
        <path d="M22 0h17v246H22zM63 0h10v211H63zM458 0h22v251h-22zM417 0h12v219h-12z" />
        <path d="M16 78 4 53v-9l29 29 31-28v14L35 91ZM454 94l-30-24V58l40 26 42-44v14l-42 49z" />
      </g>
      <g className="scene-canopy" fill="#2f6254">
        <path d="M0 0h147v13h-19v13h-29v14H60v14H25v-9H0zM520 0H373v13h19v13h29v14h39v14h35v-9h25z" />
      </g>
      <g fill="#549075" opacity=".5">
        <path d="M0 19h41v10h29v8H21v-7H0zM464 20h56v9h-30v11h-37v-8h11z" />
      </g>
      <ellipse
        cx="260"
        cy="364"
        rx="180"
        ry="30"
        fill="#0a242c"
        opacity=".65"
      />
      <ellipse
        className="ground-sigil"
        cx="260"
        cy="345"
        rx="159"
        ry="34"
        fill="none"
        stroke="#8ee9b1"
        strokeWidth="2"
        strokeDasharray="12 9 3 9"
      />
      <ellipse cx="260" cy="350" rx="118" ry="17" fill="#2e675a" />
      <path d="M91 351h338v18H91zM116 334h289v20H116z" fill="#354c53" />
      <path d="M96 351h323v4H96zM122 334h276v4H122z" fill="#7a9b83" />
      <path d="M134 312h252v26H134z" fill="#56796b" />
      <path d="M147 319h226v5H147z" fill="#91a884" />
      <g className="machine-core">
        {machineLevel >= 35 && <g className="dimension-rings" fill="none" stroke="#9fddff" strokeWidth="4">
          <ellipse cx="260" cy="201" rx="141" ry="119" strokeDasharray="24 8" />
          <ellipse cx="260" cy="201" rx="123" ry="146" stroke="#d8b2ff" strokeWidth="3" />
          <path d="M104 180h22v42h-22zM394 180h22v42h-22z" fill="#365867" stroke="#adcea1" />
        </g>}
        <path
          d="M164 304V126h18v-25h27V82h103v19h27v25h18v178z"
          fill="#192f3b"
          stroke="#aba77c"
          strokeWidth="10"
        />
        <path
          d="M181 285V135h18v-20h25V98h73v17h25v20h18v150z"
          fill="#476574"
        />
        <path
          d="M187 280V139h17v-20h22v-15h68v7h-65v16h-19v20h-15v133z"
          fill="#a5bba3"
        />
        <path d="M325 145h9v139h-9z" fill="#263e50" />
        <path d="M203 278V146h16v-20h82v20h16v132z" fill={`url(#${portal})`} />
        <g clipPath={`url(#${clip})`}>
          <g className="portal-vortex" fill="none" stroke="#c1ffe4">
            <ellipse
              cx="260"
              cy="200"
              rx="48"
              ry="64"
              opacity=".55"
              strokeDasharray="17 10"
            />
            <ellipse cx="260" cy="200" rx="36" ry="48" opacity=".45" />
            <ellipse
              cx="260"
              cy="200"
              rx="22"
              ry="31"
              opacity=".7"
              strokeDasharray="3 8"
            />
          </g>
          <g className="portal-stream" fill="#d0ffca">
            {Array.from({ length: 14 }, (_, i) => (
              <rect
                key={i}
                x={214 + ((i * 7) % 85)}
                y={131 + ((i * 29) % 145)}
                width={(i % 3) + 1}
                height={(i % 4) + 2}
                style={{ animationDelay: `${-i * 0.3}s` }}
              />
            ))}
          </g>
          <path
            className="portal-shimmer"
            d="M189 262 319 126h22L210 287z"
            fill="#b3fff4"
            opacity=".13"
          />
        </g>
        {machineLevel >= 50 && <g className="portal-awakened" fill="#e2ffdc">
          <path d="M254 130h12v143h-12zM215 194h91v12h-91z" opacity=".3" />
          <path d="M248 151h24v12h12v76h-12v12h-24v-12h-12v-76h12z" fill="none" stroke="#fff9c0" strokeWidth="4" />
          <path d="M245 63h30v10h10v12h-50V73h10z" fill="#f9df95" />
        </g>}
        <g className="portal-runes" fill="#e3ffd1">
          <path d="M250 179h20v7h7v23h-7v8h-20v-8h-7v-23h7z" opacity=".6" />
          <path d="M256 187h9v22h-9zM249 194h23v8h-23z" fill="#ffffff" />
        </g>
        <g fill="#e4d5a0">
          {[144, 181, 218, 255].map((y, i) => (
            <g key={y}>
              <path d={`M170 ${y}h6v6h-6zM345 ${y}h6v6h-6z`} />
              <path d={`M173 ${y - 3}v12M348 ${y - 3}v12`} stroke="#648c85" />
            </g>
          ))}
        </g>
        <g className="machine-cog" transform="translate(260 96)">
          <path d="M-14-6h8v-8H6v8h8V6H6v8H-6V6h-8z" fill="#b6ad7d" />
          <rect x="-4" y="-4" width="8" height="8" fill="#315357" />
        </g>
      </g>
      {machineLevel >= 10 && <g className="scene-vines" fill="#73ce9d">
        <path d="M153 300h-9V159h12v-37h12v49h-9v129zM352 300h12V151h-12v-27h-12v48h12z" />
        <path d="M145 180h-29v-10h29zM153 148h33v9h-33zM353 193h37v10h-37zM340 135h-28v9h28z" fill="#b0ed9c" />
        <path d="M127 170h10v10h-10zM372 194h10v10h-10zM175 149h10v9h-10z" fill="#efb7e3" />
      </g>}
      {machineLevel >= 20 && <g className="portal-runes" fill="none" stroke="#e7db9f" strokeWidth="3">
        {[145, 180, 215, 250].map(y => <g key={y}><path d={`M181 ${y}h10v10h-10zM330 ${y}h10v10h-10zM182 ${y + 4}h8M331 ${y + 4}h8`} /></g>)}
        <path d="M216 111h12v-8h12M281 103h12v8h12" />
      </g>}
      <path
        d="M224 281h72v13h-72zM210 294h100v14H210zM196 307h128v13H196z"
        fill="#b2b998"
      />
      <path
        d="M224 289h72v5h-72zM210 303h100v5H210zM196 315h128v5H196z"
        fill="#607773"
      />
      {[119, 365].map((x) => (
        <g key={x}>
          <path d={`M${x} 245h37v72h-37z`} fill="#395463" />
          <path d={`M${x + 5} 251h6v59h-6z`} fill="#668a8c" />
          <path d={`M${x - 8} 238h53v13h-53z`} fill="#859d88" />
          <path d={`M${x + 6} 218h24v22h-24z`} fill="#69ba9c" />
          <path
            className="energy-crystal"
            d={`M${x + 12} 201h12v10h6v13h-6v8h-12v-8h-6v-13h6z`}
            fill="#c3ffc7"
          />
          <path
            d={`M${x + 13} 252h12v4h-12zM${x + 13} 263h12v4h-12zM${x + 13} 274h12v4h-12z`}
            fill="#9ae9b4"
          />
        </g>
      ))}
      <g className="scene-vines">
        <path
          d="M147 311v-89h10v-42h11v-20h9v72h-10v79zM331 313v-60h11v-37h11v97z"
          fill="#377563"
        />
        <g fill="#78b67c">
          <path d="M143 261h-20v-9h20v-15h12v34h-12zM161 196h23v10h-23zM338 276h30v10h-30zM333 299h-20v-10h20zM167 106h24v9h-24zM181 95h24v9h-24zM322 113h27v10h-27z" />
        </g>
        <g fill="#bae29a">
          <path d="M122 253h20v3h-20zM163 198h18v3h-18zM339 277h24v3h-24z" />
        </g>
      </g>
      <g className="scene-flowers">
        <path
          d="M107 333h8v16h-8zM403 329h7v15h-7zM58 340h5v20h-5zM453 345h4v17h-4z"
          fill="#c6d5ac"
        />
        <g fill="#de91ba">
          <path d="M92 324h38v9H92zM101 315h20v9h-20zM388 319h36v10h-36zM397 310h18v9h-18z" />
        </g>
        <path
          d="M104 319h7v4h-7zM118 327h6v3h-6zM399 314h5v4h-5z"
          fill="#ffe8ce"
        />
        <path d="M51 338h18v6H51zM447 342h15v5h-15z" fill="#b3a0f0" />
      </g>
      <g fill="#456e58">
        <path d="M49 370v-19h7v10h9v-21h6v30zM433 371v-22h6v13h8v-28h7v37zM139 368v-8h18v-8h8v16z" />
      </g>
      <g fill="#d2ffc2">
        {Array.from({ length: 22 }, (_, i) => (
          <rect
            key={i}
            className="firefly"
            x={49 + ((i * 67) % 420)}
            y={45 + ((i * 43) % 295)}
            width={(i % 3) + 2}
            height={(i % 3) + 2}
            style={{ animationDelay: `${-i * 0.31}s` }}
          />
        ))}
      </g>
      {machineLevel >= 5 && (
        <g fill="#eccc8b">
          <path
            className="crown-crystal"
            d="M249 57h22v20h-22zM240 65h40v6h-40z"
          />
          <path d="M98 268h12v-15h12v15h9v38H98zM391 268h12v-15h12v15h9v38h-33z" fill="#91ebd2" />
          <path d="M103 269h6v32h-6zM396 269h6v32h-6z" fill="#d6ffed" />
        </g>
      )}
    </svg>
  );
}
export default memo(Machine);
