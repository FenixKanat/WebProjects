document.addEventListener('DOMContentLoaded', function() {
    fetch('books.json')
        .then(response => response.json())
        .then(books => {
            const app = document.getElementById('app');
            books.forEach(book => {
                const bookCard = `<div class="card book-card" style="width: 18rem;">
                                      <img class="card-img-top" src="${book.imageUrl}" alt="${book.title}">
                                      <div class="card-body">
                                        <h5 class="card-title">${book.title}</h5>
                                        <p class="card-text">${book.description}</p>
                                        <button class="btn btn-primary add-to-cart" data-id="${book.id}">Add to Cart</button>
                                      </div>
                                  </div>`;
                app.innerHTML += bookCard;
            });

        });
});
