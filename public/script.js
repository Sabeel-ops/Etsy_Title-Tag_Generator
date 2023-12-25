// script.js

// script.js
"use strict";
function dragNdrop(event) {
  var preview = document.getElementById("preview");
  var previewImg = document.createElement("img");
  previewImg.setAttribute("id", "previewImage");  // Added an id to the image element
  previewImg.setAttribute("src", URL.createObjectURL(event.target.files[0]));
  preview.innerHTML = "";
  preview.appendChild(previewImg);
}


function drag() {
  document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}

function drop() {
  document.getElementById('uploadFile').parentNode.className = 'dragBox';
}
async function generateContent() {
  try {
    console.log('Generating content...');
    
    const imageInput = document.getElementById('imgInput');
    const resultContainer1 = document.getElementById('resultContainer1');
    const resultContainer2 = document.getElementById('resultContainer2');
    const preview = document.getElementById('preview');

    if (imageInput.files.length > 0) {
      console.log('Image selected.');
      
      const imageFile = imageInput.files[0];
      const imageData = await readFileAsBase64(imageFile);

      // Preserve the image preview
      const previewImg = document.createElement('img');
      previewImg.setAttribute('src', imageData);
      preview.innerHTML = '';
      preview.appendChild(previewImg);

      console.log('Image preview set.');

      // Use fetch to make the AJAX requests
      const response1 = await fetch('http://localhost:4000/generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData, text: 'Generate an SEO optimized Etsy title for this product that will rank well on Etsy' }),
      });

      const response2 = await fetch('http://localhost:4000/generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData, text: 'Generate 20 SEO optimized Etsy tags separated by commas for this product that will rank well on Etsy. Do not enclose them in quotes' }),
      });

      if (response1.ok && response2.ok) {
        const result1 = await response1.json();
        const result2 = await response2.json();
        
        console.log('Generated texts:', result1.result, result2.result);
        
        // Display both generated texts in separate containers
        resultContainer1.innerHTML = `<p>${result1.result}</p>`;
        resultContainer2.innerHTML = `<p>${result2.result}</p>`;
      } else {
        console.error('Error generating content:', response1.statusText, response2.statusText);
        resultContainer1.innerHTML = "<p>Error generating content.</p>";
        resultContainer2.innerHTML = "<p>Error generating content.</p>";
      }
    } else {
      console.log('No image selected.');
      resultContainer1.innerHTML = "<p>Please select an image.</p>";
      resultContainer2.innerHTML = "<p>Please select an image.</p>";
    }
  } catch (error) {
    console.error('Error generating content:', error);
  }
}


function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);

    if (file instanceof Blob) {
      reader.readAsDataURL(file);
    } else {
      resolve(file);
    }
  });
}

function copyResult() {
  const resultContainer1 = document.getElementById('resultContainer1');
  const resultText = resultContainer1.innerText;

  // Create a textarea element to temporarily hold the text
  const textarea = document.createElement('textarea');
  textarea.value = resultText;

  // Append the textarea to the document
  document.body.appendChild(textarea);

  // Select and copy the text from the textarea
  textarea.select();
  document.execCommand('copy');

  // Remove the textarea from the document
  document.body.removeChild(textarea);

  // Provide some feedback, e.g., alert or console.log
  alert('Result copied to clipboard!');
}

function copyResult2() {
  const resultContainer2 = document.getElementById('resultContainer2');
  const resultText = resultContainer2.innerText;

  // Create a textarea element to temporarily hold the text
  const textarea = document.createElement('textarea');
  textarea.value = resultText;

  // Append the textarea to the document
  document.body.appendChild(textarea);

  // Select and copy the text from the textarea
  textarea.select();
  document.execCommand('copy');

  // Remove the textarea from the document
  document.body.removeChild(textarea);

  // Provide some feedback, e.g., alert or console.log
  alert('Result copied to clipboard!');
}
