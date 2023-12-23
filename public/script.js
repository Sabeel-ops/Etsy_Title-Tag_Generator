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
    const resultContainer = document.getElementById('resultContainer');
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

      // Use fetch to make the AJAX request
      const response = await fetch('http://localhost:4000/generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Generated text:', result.result);
        resultContainer.innerHTML = `<p>${result.result}</p>`;
      } else {
        console.error('Error generating content:', response.statusText);
        resultContainer.innerHTML = "<p>Error generating content.</p>";
      }
    } else {
      console.log('No image selected.');
      resultContainer.innerHTML = "<p>Please select an image.</p>";
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
  const resultContainer = document.getElementById('resultContainer');
  const resultText = resultContainer.innerText;

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


