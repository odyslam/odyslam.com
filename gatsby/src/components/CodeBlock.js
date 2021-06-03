// import React from 'react'
// import Highlight, {defaultProps} from 'prism-react-renderer'

// export default ({children, className}) => {
//   const language = className.replace(/language-/, '')

//   return (
//     <Highlight {...defaultProps} code={children} language={language}>
//       {({className, style, tokens, getLineProps, getTokenProps}) => (
//         <pre className={className} style={{...style, padding: '20px'}}>
//           {tokens.map((line, i) => (
//             <div key={i} {...getLineProps({line, key: i})}>
//               {line.map((token, key) => (
//                 <span key={key} {...getTokenProps({token, key})} />
//               ))}
//             </div>
//           ))}
//         </pre>
//       )}
//     </Highlight>
//   )
// }

import React from "react"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/nightOwl"

const RE = /{([\d,-]+)}/

const calculateLinesToHighlight = meta => {
  if (!RE.test(meta)) {
    return () => false
  }
  const lineNumbers = RE.exec(meta)[1]
    .split(`,`)
    .map(v => v.split(`-`).map(x => parseInt(x, 10)))
  return index => {
    const lineNumber = index + 1
    const inRange = lineNumbers.some(([start, end]) =>
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start
    )
    return inRange
  }
}

const Code = ({ codeString, language, metastring, ...props }) => {
  const shouldHighlightLine = calculateLinesToHighlight(metastring)

  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
      {...props}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className="gatsby-highlight" data-language={language}>
          <pre className={className} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i })

              if (shouldHighlightLine(i)) {
                lineProps.className = `${lineProps.className} highlight-line`
              }

              return (
                <div {...lineProps}>
                  <span className="line-number-style">{i + 1}</span>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              )
            })}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

export default Code