import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Book from "./components/Book";
import Library from "./utils/Library.json";
const LibraryContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const [title, setTitle] = useState();
  const [books, setBooks] = useState([]);
  const [author, setAuthor] = useState();
  const [year, setYear] = useState();
  const [WalletAddress, setWalletAddress] = useState();
  const [booksdisplay, setBooksDisplay] = useState([]);

  const display = [];

  for (let i = 0; i < books.length; i++) {
    display.push(
      <Book
        key={books[i].id.toString()}
        id={books[i].id.toString()}
        title={books[i].name}
        author={books[i].author}
        year={books[i].year.toString()}
        finished={books[i].finished}
      />
    );
  }

  // useEffect(() => {
  //   for (let i = 0; i < books.length; i++) {
  //     display.push(
  //       <Book
  //         key={i}
  //         title={books[i].name}
  //         author={books[i].author}
  //         year={books[i].year.toString()}
  //       />
  //     );
  //   }
  // }, [books]);

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      window.alert("Please add Metamask Extension and add HardHat network");
    } else {
      const accoounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accoounts[0]);
    }
  };

  const submitBook = async () => {
    let book = {
      name: title,
      author: author,
      year: parseInt(year),
      finished: false,
    };

    try {
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error(
          "Ethereum object not found. Please install MetaMask or a compatible Ethereum provider."
        );
      }

      if (ethereum && ethereum.isMetaMask) {
        let url = "http://127.0.0.1:8545/";
        const provider = new ethers.providers.JsonRpcProvider(url);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          signer
        );

        let libraryTx = await LibraryContract.addBook(
          book.name,
          book.author,
          book.year,
          book.finished
        );

        console.log(libraryTx);
        getBooks();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error Submitting new Book", error);
    }
  };

  const getBooks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        let url = "http://127.0.0.1:8545/";
        const provider = new ethers.providers.JsonRpcProvider(url);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          signer
        );

        let booksFinished = await LibraryContract.getfinishedBooks();

        let booksUnFinished = await LibraryContract.getUnfinishedBooks();

        console.log(booksUnFinished);
        console.log("Books:- ");
        console.log(booksFinished);

        let books = booksFinished.concat(booksUnFinished);
        setBooks(books);
        console.log(books.toString());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clickBookFinished = async (id) => {
    console.log(id);

    try {
      const { ethereum } = window;

      if (ethereum) {
        let url = "http://127.0.0.1:8545/";
        const provider = new ethers.providers.JsonRpcProvider(url);
        const signer = provider.getSigner();
        const LibraryContract = new ethers.Contract(
          LibraryContractAddress,
          Library.abi,
          signer
        );

        let libraryTx = await LibraryContract.setFinished(id, true);

        console.log(libraryTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error Submitting new Book", error);
    }
  };

  return (
    <div className="bg-gray-900 m-0 p-0 bg-scroll">
      <div className="flex justify-between items-center bg-gray-800 rounded-md px-[5%] py-3 border-b-2 border-solid border-blue-200 ">
        <div className="text-2xl font-medium text-white">Library</div>
        <div className="flex justify-between items-center  ">
          <input
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            className="mx-1 px-2 py-1 outline-none rounded-md"
            type="text"
            placeholder="enter title"
          ></input>
          <input
            onChange={(event) => {
              setAuthor(event.target.value);
            }}
            className="mx-1 px-2 py-1 outline-none rounded-md"
            type="text"
            placeholder="enter author"
          ></input>
          <input
            onChange={(event) => {
              setYear(event.target.value);
            }}
            className="mx-1 px-2 py-1 outline-none rounded-md"
            type="text"
            placeholder="enter published"
          ></input>
          <button
            onClick={submitBook}
            className=" bg-blue-400  p-2 rounded-md hover:scale-105 mx-2"
            type="submit"
          >
            Add Book
          </button>
          <button
            onClick={connectWallet}
            className=" bg-green-900 text-white  p-2 rounded-md hover:scale-105 mx-2"
          >
            {!WalletAddress ? "Connect Wallet" : WalletAddress.toString()}
          </button>
          <button
            className="bg-[#047aed] px-2 py-2 rounded-md hover:scale-105"
            onClick={getBooks}
          >
            getBooks
          </button>
        </div>
      </div>
      <div className="justify-center items-center min-h-screen container mx-auto p-5 ">
        <div className=" grid grid-cols-1 md:grid-cols-6 lg:grid-col-4 mx-auto ">
          {display}
        </div>
      </div>
    </div>
  );
}
