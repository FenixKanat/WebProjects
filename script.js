let booksGlobal = []; 

document.addEventListener('DOMContentLoaded', function() {
    fetch('books.json')
        .then(response => response.json())
        .then(books => {
            booksGlobal = books; 
            displayBooks(books);
        });
});

function displayBooks(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = ''; 
    books.forEach(book => {
        const bookCard = `<div class="card book-card" style="width: 18rem;">
                              <img class="card-img-top" src="${book.imageUrl}" alt="${book.title}">
                              <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-author">Author: ${book.author}</p>
                                <p class="card-price">Price: $${book.price}</p>
                                <p class="card-text">${book.description}</p>
                                <button class="btn btn-primary add-to-cart" data-id="${book.id}">Add to Cart</button>
                              </div>
                          </div>`;
        booksContainer.innerHTML += bookCard;
    });
}


function applyFilters() {
    const category = document.getElementById('filter-category').value;
    const author = document.getElementById('filter-author').value;
    const minPrice = document.getElementById('filter-price-min').value;
    const maxPrice = document.getElementById('filter-price-max').value;

    let filteredBooks = booksGlobal.filter(book => 
        (category ? book.category === category : true) &&
        (author ? book.author === author : true) &&
        (minPrice ? book.price >= minPrice : true) &&
        (maxPrice ? book.price <= maxPrice : true)
    );

    displayBooks(filteredBooks);
}

function sortBooks(property, order) {
    let sortedBooks = [...booksGlobal]; 
    sortedBooks.sort((a, b) => {
        if (a[property] < b[property]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[property] > b[property]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });
    displayBooks(sortedBooks);
}
