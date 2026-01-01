// ===== Teddy Virtue Mythos - Main App =====

let storiesData = null;
let hoverTimeout = null;
let currentFilter = 'all';

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadStories();

  // Detect which page we're on
  if (document.querySelector('.library')) {
    initLibraryPage();
  } else if (document.querySelector('.story-page')) {
    initStoryPage();
  }
});

// ===== Load Stories Data =====
async function loadStories() {
  try {
    const response = await fetch('/data/stories.json');
    storiesData = await response.json();
  } catch (error) {
    console.error('Failed to load stories:', error);
    // Fallback for local file testing
    storiesData = {
      virtues: ["courage", "kindness", "patience", "honesty", "perseverance"],
      stories: [{
        id: "the-brave-little-bear",
        title: "The Brave Little Bear",
        preview: "A story about finding courage in unexpected places...",
        content: "Once upon a time, in a cozy corner of a child's room, there lived a small brown bear named Theodore...",
        virtue: "courage",
        teddy: {
          name: "Theodore",
          idleImage: "/assets/teddies/theodore-idle.png",
          hoverImage: "/assets/teddies/theodore-hover.png"
        }
      }]
    };
  }
}

// ===== Library Page =====
function initLibraryPage() {
  renderTeddies();
  initFilters();
  initPreviewBubble();
}

// ===== Render Teddies on Shelf =====
function renderTeddies(filterVirtue = 'all') {
  const grid = document.getElementById('teddy-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const stories = filterVirtue === 'all'
    ? storiesData.stories
    : storiesData.stories.filter(s => s.virtue === filterVirtue);

  stories.forEach(story => {
    const teddyEl = document.createElement('div');
    teddyEl.className = 'teddy-item';
    teddyEl.dataset.storyId = story.id;
    teddyEl.dataset.title = story.title;
    teddyEl.dataset.preview = story.preview;

    // Use placeholder if images don't exist yet
    teddyEl.innerHTML = `
      <img
        src="${story.teddy.idleImage}"
        alt="${story.teddy.name}"
        class="teddy-image idle"
        onerror="this.style.display='none'; this.nextElementSibling.nextElementSibling.style.display='block';"
      >
      <img
        src="${story.teddy.hoverImage}"
        alt="${story.teddy.name} excited"
        class="teddy-image hover"
        onerror="this.style.display='none';"
      >
      <div class="placeholder-teddy" style="display: none;"></div>
    `;

    // Check if we need placeholder immediately
    const idleImg = teddyEl.querySelector('.idle');
    const placeholderCheck = new Image();
    placeholderCheck.onerror = () => {
      teddyEl.querySelector('.idle').style.display = 'none';
      teddyEl.querySelector('.hover').style.display = 'none';
      teddyEl.querySelector('.placeholder-teddy').style.display = 'block';
    };
    placeholderCheck.src = story.teddy.idleImage;

    grid.appendChild(teddyEl);
  });

  // Add click handlers
  document.querySelectorAll('.teddy-item').forEach(teddy => {
    teddy.addEventListener('click', handleTeddyClick);
  });
}

// ===== Filter Functionality =====
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter teddies
      currentFilter = btn.dataset.virtue;
      renderTeddies(currentFilter);
    });
  });
}

// ===== Preview Bubble =====
function initPreviewBubble() {
  const bubble = document.getElementById('preview-bubble');
  const bubbleTitle = bubble.querySelector('.bubble-title');
  const bubblePreview = bubble.querySelector('.bubble-preview');

  document.addEventListener('mouseover', (e) => {
    const teddy = e.target.closest('.teddy-item');

    if (teddy) {
      // Clear any existing timeout
      clearTimeout(hoverTimeout);

      // Delay before showing bubble (300ms)
      hoverTimeout = setTimeout(() => {
        bubbleTitle.textContent = teddy.dataset.title;
        bubblePreview.textContent = teddy.dataset.preview;

        // Position bubble near teddy
        const rect = teddy.getBoundingClientRect();
        bubble.style.left = `${rect.left + rect.width / 2 - 125}px`;
        bubble.style.top = `${rect.top - 120}px`;

        // Keep bubble on screen
        const bubbleRect = bubble.getBoundingClientRect();
        if (bubbleRect.left < 10) {
          bubble.style.left = '10px';
        }
        if (bubbleRect.right > window.innerWidth - 10) {
          bubble.style.left = `${window.innerWidth - 260}px`;
        }
        if (bubbleRect.top < 10) {
          bubble.style.top = `${rect.bottom + 20}px`;
        }

        bubble.classList.add('visible');
      }, 300);
    }
  });

  document.addEventListener('mouseout', (e) => {
    const teddy = e.target.closest('.teddy-item');
    if (teddy) {
      clearTimeout(hoverTimeout);
      bubble.classList.remove('visible');
    }
  });

  // Touch support: tap to show, tap again to navigate
  let tappedTeddy = null;

  document.addEventListener('touchstart', (e) => {
    const teddy = e.target.closest('.teddy-item');

    if (teddy) {
      if (tappedTeddy === teddy) {
        // Second tap - navigate to story
        handleTeddyClick({ currentTarget: teddy });
        tappedTeddy = null;
      } else {
        // First tap - show preview
        e.preventDefault();
        tappedTeddy = teddy;

        bubbleTitle.textContent = teddy.dataset.title;
        bubblePreview.textContent = teddy.dataset.preview;

        const rect = teddy.getBoundingClientRect();
        bubble.style.left = `${rect.left + rect.width / 2 - 125}px`;
        bubble.style.top = `${rect.top - 120}px`;

        bubble.classList.add('visible');
      }
    } else {
      // Tapped elsewhere, hide bubble
      tappedTeddy = null;
      bubble.classList.remove('visible');
    }
  });
}

// ===== Navigate to Story =====
function handleTeddyClick(e) {
  const storyId = e.currentTarget.dataset.storyId;
  navigateWithTransition(`story.html?id=${storyId}`);
}

// ===== Smooth Page Transition =====
function navigateWithTransition(url) {
  // Use View Transitions API if available
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      window.location.href = url;
    });
  } else {
    // Fallback: animate out, then navigate
    const container = document.querySelector('.library') || document.querySelector('.story-container');
    if (container) {
      container.classList.add('page-exit');
      setTimeout(() => {
        window.location.href = url;
      }, 300);
    } else {
      window.location.href = url;
    }
  }
}

// ===== Story Page =====
function initStoryPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get('id');

  if (!storyId || !storiesData) {
    window.location.href = 'index.html';
    return;
  }

  const story = storiesData.stories.find(s => s.id === storyId);

  if (!story) {
    window.location.href = 'index.html';
    return;
  }

  // Add smooth transition to back button
  const backBtn = document.getElementById('back-button');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateWithTransition('index.html');
    });
  }

  // Populate story content
  document.getElementById('story-title').textContent = story.title;
  document.getElementById('virtue-tag').textContent = story.virtue;
  document.getElementById('story-text').textContent = story.content;

  // Set teddy image
  const teddyContainer = document.getElementById('story-teddy');
  teddyContainer.innerHTML = `
    <img
      src="${story.teddy.hoverImage}"
      alt="${story.teddy.name}"
      onerror="this.outerHTML='<div class=\\'placeholder-teddy\\'></div>'"
    >
  `;

  // Update page title
  document.title = `${story.title} - Teddy Virtue Mythos`;
}
