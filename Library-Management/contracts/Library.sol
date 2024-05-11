// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Library {
    event AddBook(address recipient, uint bookId);
    event SetFinished(address recipient, uint bookId);

    struct Book {
        uint id;
        string name;
        string author;
        uint year;
        bool finished;
    }

    Book[] private BookList;

    mapping(uint => address) bookToOwner;

    function addBook(
        string memory name,
        string memory author,
        uint year,
        bool finished
    ) external {
        uint bookId = BookList.length;
        BookList.push(Book(bookId, name, author, year, finished));
        bookToOwner[bookId] = msg.sender;
        emit AddBook(msg.sender, bookId);
    }

    function getBookList(bool finished) private view returns (Book[] memory) {
        Book[] memory temp = new Book[](BookList.length);
        uint counter = 0;
        for (uint i = 0; i < BookList.length; i++) {
            if (
                bookToOwner[i] == msg.sender && BookList[i].finished == finished
            ) {
                temp[counter] = BookList[i];
                counter++;
            }
        }
        Book[] memory result = new Book[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    function getfinishedBooks() external view returns (Book[] memory) {
        return getBookList(true);
    }

    function getUnfinishedBooks() external view returns (Book[] memory) {
        return getBookList(false);
    }

    function setFinished(uint bookId) external {
        if (bookToOwner[bookId] == msg.sender) {
            BookList[bookId].finished = true;
            emit SetFinished(msg.sender, bookId);
        }
    }
}
