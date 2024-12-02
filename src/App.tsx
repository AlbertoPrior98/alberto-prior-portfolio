import { useEffect, useState } from 'react'

// This is a typescript react component. You can drop it into a react dev environment to test it.
// (We recommend vite.js)
// We are making a very simplistic translation interface. This test should be relatively fast
// so do not go overboard and make it long and complex.
// Please complete the code according to the comments.
// Please do not use AI tools to write the code. We'd rather see interesting, but slightly flawed code
// than bland AI-generated code. 
// In case we invite you for an interview, we will use your code as a discussion point as well.

function App() {
  const [targetText, setTargetText] = useState(`While holding <OPT ZL>, press <ICON PAD_X> <COL RED>to move
vertically</COL>, press <ICON PAD_A> <COL RED>to move forward</COL>, and
press <OPT ZR> <COL RED>to move where you are aiming</COL>.`);
  const [sourceCounts, setSourceCounts] = useState('0');
  const [targetCounts, setTargetCounts] = useState('0');
  const [qualityCheckWarning, setQualityCheckWarning] = useState('');
  const sourceText = `<OPT ZL>を押しながら
<ICON PAD_X>で<COL RED>上方移動</COL>、<ICON PAD_A>で<COL RED>前方移動</COL>、
<OPT ZR>で<COL RED>照準の方向へ移動</COL>ができます。`;

  const countChars = () => {
    // Implement a method that counts the characters per line and displays the counts next to the source
    // and translation text. 
    // todo steps
    //split per lines. /n? -> ok
    const sourceLinesArray = sourceText.split('\n');
    const targetLinesArray = targetText.split('\n');

    //count each line char

    let sourceCountsArray: number[] = [];
    let targetCountsArray: number[] = [];

    sourceLinesArray.forEach(line => sourceCountsArray.push(line.length));
    targetLinesArray.forEach(line => targetCountsArray.push(line.length));

    //print next to source separated by \n to try to align them to the right line
    setSourceCounts(sourceCountsArray.join('\n '));
    setTargetCounts(targetCountsArray.join('\n '));

  }


  const extractPlaceholders = (text: string): string[] => {
    const regex = /<[^>]+>/g;
    return text.match(regex) || [];
  }
  const generateRandomColor = (usedColors: Set<string>) => {
    let color;
    do {
      color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    } while (usedColors.has(color));
    usedColors.add(color);
    return color;
  };

  const checkQuality = () => {

    // Implement a method that checks for a *single* common quality issue or translation mistake in the target text
    // and then shows the qualityCheckWarning if detected. 
    // For this test just choose a single issue to check for. We do not want you to write a whole checking suite.

    //check that every lines contain the same placeholders
    //pseudo code / idea
    //for every lines
    //check place holder -> fun extractPlaceHolder
    // are them the same?

    const sourceLinesArray = sourceText.split('\n');
    const targetLinesArray = targetText.split('\n');

    let warnings: string[] = [];

    // Iterate over lines
    sourceLinesArray.forEach((sourceLine, index) => {
      const sourcePlaceholders = extractPlaceholders(sourceLine);
      const targetPlaceholders = extractPlaceholders(targetLinesArray[index] || ""); //to avid errors if translation lis empty 

      // Identify missing and additional placeholders
      const missingPlaceholders = sourcePlaceholders.filter(ph => !targetPlaceholders.includes(ph));
      const additionalPlaceholders = targetPlaceholders.filter(ph => !sourcePlaceholders.includes(ph));

      // Add warnings for missing and additional placeholders
      if (missingPlaceholders.length > 0) {
        warnings.push(
          `Line ${index + 1}: ${missingPlaceholders.length} missing placeholder(s): ${missingPlaceholders.join(", ")}`
        );
      }

      if (additionalPlaceholders.length > 0) {
        warnings.push(
          `Line ${index + 1}: ${additionalPlaceholders.length} additional placeholder(s): ${additionalPlaceholders.join(", ")}`
        );
      }
    });

    // Print warnings
    setQualityCheckWarning(warnings.join('\n'));

  }


  const doAction = () => {
    const sourcePlaceholders = extractPlaceholders(sourceText);
    const targetPlaceholders = extractPlaceholders(targetText);

    // Combine placeholders from both texts to ensure consistent coloring
    const allPlaceholders = Array.from(new Set([...sourcePlaceholders, ...targetPlaceholders]));

    // Assign a unique color to each placeholder
    const placeholderColors = new Map<string, string>();
    const usedColors = new Set<string>();
    allPlaceholders.forEach(placeholder => {
      placeholderColors.set(placeholder, generateRandomColor(usedColors));
    });

    // Function to escape HTML special characters
    const escapeHTML = (text: string): string =>
      text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Function to wrap placeholders in spans with colors
    const colorizeText = (text: string): string => {
      return text.replace(/<[^>]+>/g, match => {
        const escapedPlaceholder = escapeHTML(match); // Escape to prevent invalid HTML rendering
        const color = placeholderColors.get(match) || '#000'; // Default color
        return `<span style="color: ${color}; font-weight: bold;">${escapedPlaceholder}</span>`;
      });
    };

    // Update the source and target text with colored placeholders
    const updatedSourceText = colorizeText(sourceText);
    const updatedTargetText = colorizeText(targetText);

    // Set the updated HTML in the DOM
    const sourceTextElement = document.getElementById('source-text');
    const targetTextElement = document.getElementById('target-text');
    if (sourceTextElement) sourceTextElement.innerHTML = updatedSourceText;
    if (targetTextElement) targetTextElement.innerHTML = updatedTargetText;
  }

  // Call countChars when the texts are updated to print the num of lines
  useEffect(() => {
    countChars();
    checkQuality();
  }, [sourceText, targetText]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', gap: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ width: '100px' }}>Source</div>
        <textarea value={sourceCounts} readOnly style={{width:'30px', resize:'none'}} rows={6} />
        <div id="source-text" style={{ width: '600px', height: '100px', overflow: 'auto', border: '1px solid #ccc', padding: '5px', whiteSpace: 'pre-wrap' }}>
          {sourceText}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ width: '100px' }}>Translation</div>
        <textarea value={targetCounts} readOnly style={{width:'30px', resize:'none'}} rows={6} />
        <div id="target-text" style={{ width: '600px', height: '100px', overflow: 'auto', border: '1px solid #ccc', padding: '5px', whiteSpace: 'pre-wrap' }}>
          {targetText}
        </div>
      </div>
      <button onClick={doAction}>Do Action</button>
      <div style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
        {qualityCheckWarning}
      </div>
      {/* <div style={{color:'red'}}>{qualityCheckWarning}</div> 
        edited to show warnings in different lines for readability 
      */}
    </div>
  )
}

export default App
