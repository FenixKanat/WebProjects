let booksGlobal = [];
let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    fetch('books.json')
        .then(response => response.json())
        .then(books => {
            booksGlobal = books; 
            displayBooks(books);
            populateAuthorFilter(books);
        });
});

function addBookToCart(book){
    const existingItem = cart.find(item => item.id === book.id);
    if(existingItem){
        existingItem.quantity++;
    }else {
        cart.push({...book, quantity: 1});
    }
    updateCartDisplay();
}

function updateCartDisplay(){
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const rowTotal = item.price * item.quantity;
        total += rowTotal;
        cartItemsContainer.innerHTML += `
        <tr>
            <td>${item.title}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>$${rowTotal.toFixed(2)}</td>
        </tr>
    `;
    });
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

document.querySelector('.toggle-cart').addEventListener('click', () => {
    const cartContents = document.querySelector('.cart-contents');
    cartContents.style.display = cartContents.style.display === 'none' ? 'block' : 'none';
});

function populateAuthorFilter(books){
    const authors = new Set();
    books.forEach(book => {
        authors.add(book.author);
    });

    const filterAuthor = document.getElementById('filter-author');
    authors.forEach(author => {
    const option = new Option(author, author);
    filterAuthor.add(option);
});
}

function truncateText(text, length){
    return (text.length > length) ? text.substr(0,length - 1) + '...' : text;
}

function displayBooks(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = ''; 

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'card book-card';
        bookCard.style.width = '18rem';
        const shortDescription = truncateText(book.description, 100);
        bookCard.innerHTML = `
            <img class="card-img-top" src="${book.imageUrl}" alt="${book.title}" style="cursor:pointer;">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-author">Author: ${book.author}</p>
                <p class="card-price">Price: $${book.price}</p>
                <p class="card-text">${shortDescription}</p>
                <button class="btn btn-primary add-to-cart" data-id="${book.id}">Add to Cart</button>
            </div>
            <div class="book-details" style="display:none">
            </div>
        `;

        const img = bookCard.querySelector('.card-img-top');
        img.addEventListener('click', function() {
            toggleBookDetails(book, bookCard.querySelector('.book-details'));
        });

        booksContainer.appendChild(bookCard);
    });
}

function toggleBookDetails(book, detailElement, textElement) {
    if (detailElement.style.display === 'none') {
        detailElement.innerHTML = `
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Price:</strong> $${book.price}</p>
            <p><strong>Description:</strong> ${book.description}</p>
            <img src="${book.imageUrl}" class="img-fluid" alt="${book.title}">
            <button class="btn btn-primary add-to-cart" data-id="${book.id}">Add to Cart</button>
        `;
        detailElement.style.display = 'block';
        textElement.innerHTML = book.description;
    } else {
        detailElement.style.display = 'none';
        detailElement.innerHTML = '';
        textElement.innerHTML = truncateText(book.description, 100); 
    }
}

function displayBookDetails(book) {
    const modalTitle = document.getElementById('bookDetailModalLabel');
    const modalBody = document.querySelector('#bookDetailModal .modal-body');

    modalTitle.textContent = book.title; 
    modalBody.innerHTML = `
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Price:</strong> $${book.price}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <img src="${book.imageUrl}" class="img-fluid" alt="${book.title}">
    `; 

    var bookDetailModal = new bootstrap.Modal(document.getElementById('bookDetailModal'), {});
    bookDetailModal.show();
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
