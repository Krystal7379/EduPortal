document.addEventListener("DOMContentLoaded", () => {
  const showMoreBtn = document.getElementById("show-more-btn");

  const cards = document.querySelectorAll(".subject-card");

  // Hide all cards after the 6th
  cards.forEach((card, index) => {
    if (index >= 6) {
      card.style.display = "none";
    }
  });

  let isExpanded = false;

  showMoreBtn.addEventListener("click", () => {
    cards.forEach((card, index) => {
      if (index >= 6) {
        card.style.display = isExpanded ? "none" : "block";
      }
    });

    showMoreBtn.innerText = isExpanded ? "Show More ▼" : "Show Less ▲";
    isExpanded = !isExpanded;
  });
});
