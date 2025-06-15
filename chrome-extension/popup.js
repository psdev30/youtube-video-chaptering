document.getElementById('generateBtn').addEventListener('click', async () => {
  const chaptersContainer = document.getElementById('chaptersContainer');
  const chaptersList = document.getElementById('chaptersList');
  
  // Show loading state
  chaptersList.innerHTML = '<div class="text-white text-center">Generating chapters...</div>';

  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Get the full URL from the current tab
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return window.location.href;
      }
    });

    const videoUrl = result.result;
    
    // Send video URL to our backend API
    const response = await fetch('YOUR_BACKEND_API_URL/generate-chapters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl })
    });

    const data = await response.json();

    if (data.chapters) {
      // Clear previous content
      chaptersList.innerHTML = '';
      
      // Add each chapter
      data.chapters.forEach(chapter => {
        const chapterElement = document.createElement('div');
        chapterElement.className = 'chapter-item text-white';
        chapterElement.innerHTML = `
          <div class="text-blue-400">${chapter.timestamp}</div>
          <div>${chapter.title}</div>
        `;
        chaptersList.appendChild(chapterElement);
      });
    }
  } catch (error) {
    chaptersList.innerHTML = '<div class="text-red-400 text-center">Error generating chapters. Please try again.</div>';
    console.error('Error:', error);
  }
}); 