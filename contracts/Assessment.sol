// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Library {
    address payable public owner;
    uint256 public bookCount;

    struct Book {
        uint256 id;
        string title;
        string author;
        bool isAvailable;
    }

    mapping(uint256 => Book) public books;

    event BookAdded(uint256 id, string title, string author);
    event BookBorrowed(uint256 id);
    event BookReturned(uint256 id);

    constructor() payable {
        owner = payable(msg.sender);
        bookCount = 0;
    }

    function addBook(string memory _title, string memory _author) public {
        require(msg.sender == owner, "Only the owner can add books");
        bookCount++;
        books[bookCount] = Book(bookCount, _title, _author, true);
        emit BookAdded(bookCount, _title, _author);
    }

    function borrowBook(uint256 _id) public {
        require(books[_id].isAvailable, "Book is not available");
        books[_id].isAvailable = false;
        emit BookBorrowed(_id);
    }

    function returnBook(uint256 _id) public {
        require(!books[_id].isAvailable, "Book is already available");
        books[_id].isAvailable = true;
        emit BookReturned(_id);
    }

    function getBookCount() public view returns (uint256) {
        return bookCount;
    }

    function getBook(uint256 _id) public view returns (string memory, string memory, bool) {
        return (books[_id].title, books[_id].author, books[_id].isAvailable);
    }
}