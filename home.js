document.addEventListener("DOMContentLoaded", () => {
  const showMoreBtn = document.getElementById("show-more-btn");
  const hiddenSubjects = document.querySelectorAll(".hidden-subject");

  let isExpanded = false;

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      hiddenSubjects.forEach((subject, index) => {
        if (isExpanded) {
          // Hide subjects with fade out animation
          subject.style.animation = "fadeOut 0.3s ease forwards";
          setTimeout(() => {
            subject.classList.remove("show");
            subject.style.animation = "";
          }, 300);
        } else {
          // Show subjects with fade in animation
          subject.classList.add("show");
          subject.style.animation = `fadeInUp 0.6s ease forwards`;
          subject.style.animationDelay = `${index * 0.1}s`;
        }
      });

      showMoreBtn.innerHTML = isExpanded ? "Show More ▼" : "Show Less ▲";
      isExpanded = !isExpanded;
    });
  }
});

// Tab navigation functionality
function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });

  // Show selected section
  const targetSection = document.getElementById(sectionName + '-section');
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Add active class to clicked tab
  const activeTab = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
}

// Set subjects as default view
document.addEventListener("DOMContentLoaded", () => {
  // Show subjects section by default
  showSection('subjects');
  
  // Initialize search functionality
  initializeSearch();
});

// Search functionality
let searchData = {
  teachers: [],
  subjects: [],
  books: []
};

function initializeSearch() {
  // Collect all searchable data
  collectSearchData();
  
  // Set up search event listeners
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }
  
  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(e.target)) {
      closeSearch();
    }
  });
}

function collectSearchData() {
  // Collect teachers data
  const teacherCards = document.querySelectorAll('.teacher-card');
  teacherCards.forEach(card => {
    const name = card.querySelector('h3')?.textContent || '';
    const department = card.querySelector('p')?.textContent || '';
    if (name) {
      searchData.teachers.push({
        name: name,
        department: department,
        element: card
      });
    }
  });
  
  // Collect subjects data
  const subjectCards = document.querySelectorAll('.subject-card');
  subjectCards.forEach(card => {
    const title = card.querySelector('.subject-title')?.textContent || '';
    const description = card.querySelector('.subject-description')?.textContent || '';
    if (title) {
      searchData.subjects.push({
        title: title,
        description: description,
        element: card
      });
    }
  });
  
  // Collect books data
  const bookCards = document.querySelectorAll('.book-card');
  bookCards.forEach(card => {
    const title = card.querySelector('h4')?.textContent || '';
    const author = card.querySelector('p')?.textContent || '';
    const genre = card.querySelector('.book-genre')?.textContent || '';
    if (title) {
      searchData.books.push({
        title: title,
        author: author,
        genre: genre,
        element: card
      });
    }
  });
}

function toggleSearch() {
  const searchDropdown = document.getElementById('searchDropdown');
  const searchBtn = document.querySelector('.search-btn');
  
  if (searchDropdown.classList.contains('active')) {
    closeSearch();
  } else {
    openSearch();
  }
}

function openSearch() {
  const searchDropdown = document.getElementById('searchDropdown');
  const searchBtn = document.querySelector('.search-btn');
  
  searchDropdown.classList.add('active');
  searchBtn.classList.add('searching');
  
  // Focus on input after animation
  setTimeout(() => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
    }
  }, 300);
}

function closeSearch() {
  const searchDropdown = document.getElementById('searchDropdown');
  const searchBtn = document.querySelector('.search-btn');
  const searchInput = document.getElementById('searchInput');
  
  searchDropdown.classList.remove('active');
  searchBtn.classList.remove('searching');
  
  if (searchInput) {
    searchInput.value = '';
    clearSearchResults();
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const searchResults = document.getElementById('searchResults');
  
  if (query.length < 2) {
    clearSearchResults();
    return;
  }
  
  // Add searching animation
  const searchBtn = document.querySelector('.search-btn');
  searchBtn.classList.add('searching');
  
  // Simulate search delay for better UX
  setTimeout(() => {
    const results = performSearch(query);
    displaySearchResults(results);
    searchBtn.classList.remove('searching');
  }, 200);
}

function handleSearchKeydown(e) {
  if (e.key === 'Escape') {
    closeSearch();
  }
}

function performSearch(query) {
  const results = [];
  
  // Search teachers
  searchData.teachers.forEach(teacher => {
    if (teacher.name.toLowerCase().includes(query) || 
        teacher.department.toLowerCase().includes(query)) {
      results.push({
        type: 'teacher',
        title: teacher.name,
        subtitle: teacher.department,
        element: teacher.element
      });
    }
  });
  
  // Search subjects
  searchData.subjects.forEach(subject => {
    if (subject.title.toLowerCase().includes(query) || 
        subject.description.toLowerCase().includes(query)) {
      results.push({
        type: 'subject',
        title: subject.title,
        subtitle: subject.description,
        element: subject.element
      });
    }
  });
  
  // Search books
  searchData.books.forEach(book => {
    if (book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)) {
      results.push({
        type: 'book',
        title: book.title,
        subtitle: book.author,
        element: book.element
      });
    }
  });
  
  return results.slice(0, 8); // Limit to 8 results
}

function displaySearchResults(results) {
  const searchResults = document.getElementById('searchResults');
  
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="search-result-item">
        <div class="search-result-content">
          <h4>No results found</h4>
          <p>Try searching for teachers, subjects, or books</p>
        </div>
      </div>
    `;
    return;
  }
  
  searchResults.innerHTML = results.map(result => {
    const iconClass = result.type === 'teacher' ? 'teacher' : 
                     result.type === 'subject' ? 'subject' : 'book';
    const iconText = result.type === 'teacher' ? '👨‍🏫' : 
                    result.type === 'subject' ? '📚' : '📖';
    
    return `
      <div class="search-result-item" onclick="selectSearchResult('${result.type}', '${result.title}')">
        <div class="search-result-icon ${iconClass}">${iconText}</div>
        <div class="search-result-content">
          <h4>${result.title}</h4>
          <p>${result.subtitle}</p>
        </div>
        <div class="search-result-type">${result.type}</div>
      </div>
    `;
  }).join('');
}

function clearSearchResults() {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';
}

function selectSearchResult(type, title) {
  // Close search dropdown
  closeSearch();
  
  // Switch to appropriate tab and highlight result
  if (type === 'teacher') {
    showSection('teachers');
    highlightElement(searchData.teachers.find(t => t.name === title)?.element);
  } else if (type === 'subject') {
    showSection('subjects');
    highlightElement(searchData.subjects.find(s => s.title === title)?.element);
  } else if (type === 'book') {
    showSection('books');
    highlightElement(searchData.books.find(b => b.title === title)?.element);
  }
}

function highlightElement(element) {
  if (!element) return;
  
  // Add highlight effect
  element.style.transition = 'all 0.3s ease';
  element.style.transform = 'scale(1.05)';
  element.style.boxShadow = '0 8px 25px rgba(255, 221, 85, 0.4)';
  element.style.border = '2px solid #ffdd55';
  
  // Scroll to element
  element.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
  
  // Remove highlight after 3 seconds
  setTimeout(() => {
    element.style.transform = '';
    element.style.boxShadow = '';
    element.style.border = '';
  }, 3000);
}
