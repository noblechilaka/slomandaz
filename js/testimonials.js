const cardsData = [
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@neilstellar",
    date: "April 20, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
    date: "May 10, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    date: "June 5, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Casey Riley",
    handle: "@caseycreates",
    date: "July 15, 2025",
  },
];

const createCard = (card) => `
    <div class="testimonial-card">
        <div class="card-header">
            <img class="avatar" src="${card.image}" alt="${card.name}">
            <div class="user-info">
                <div class="user-name-verified">
                    <span class="user-name">${card.name}</span>
                    <svg class="checkmark" width="14" height="14" viewBox="0 0 12 12" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="currentColor"/>
                    </svg>
                </div>
                <span class="user-handle">${card.handle}</span>
            </div>
        </div>
<p class="testimonial-quote" data-card="${card.name}">${getQuoteForUser(
  card.name
)}</p>
    </div>
`;

const quotes = {
  'Briar Martin': 'The craftsmanship is unmatched. Every piece tells a story of timeless quality and attention to detail.',
  'Avery Johnson': 'Slomandaz transformed our living space. Their design process was intuitive and the results breathtaking.',
  'Jordan Lee': 'Exceptional service from consultation to delivery. Our custom sofa is now the heart of our home.',
  'Casey Riley': 'Radiant made undercutting all of our competitors an absolute breeze. The custom furniture transformed our showroom completely.',
  'Morgan Taylor': 'Working with Slomandaz was seamless. Their bespoke joinery elevated our restaurant interior beyond expectations.'
};

function getQuoteForUser(name) {
  return quotes[name] || 'Outstanding work that exceeds expectations.';
}

const renderCards = (target) => {
  const doubled = [...cardsData, ...cardsData];
  doubled.forEach((card) =>
    target.insertAdjacentHTML("beforeend", createCard(card))
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const row1 = document.getElementById("row1");
  const row2 = document.getElementById("row2");
  if (row1 && row2) {
    renderCards(row1);
    renderCards(row2);
  }
});
