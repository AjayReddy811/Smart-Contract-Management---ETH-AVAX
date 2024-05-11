import React, { useState } from "react";
import { ethers } from "ethers";
import Library from "../utils/Library.json";
const LibraryContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const Book = ({ id, title, author, year, finished }) => {
  const [status, setStatus] = useState(finished);
  let ID = parseInt(id);
  const clickBookFinished = async (ID) => {
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

        let libraryTx = await LibraryContract.setFinished(id);

        console.log(libraryTx);
        setStatus(true);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error Submitting new Book", error);
    }
  };
  return (
    <div className="rounded-lg shadow-md overflow-hidden bg-gray-800 text-white font-extralight p-4 m-1 flex flex-col  ">
      <div className="flex flex-col justify-start items-start py-1">
        <p> Title : {title}</p>
        <p>Author : {author},</p>
        <p>Published : {year}</p>
      </div>
      <button
        onClick={clickBookFinished}
        className="rounded-md bg-[#496989] px-2 py-3 font-medium hover:scale-95 outline-none   "
      >
        {!status ? "Mark as Read" : "Completed"}
      </button>
    </div>
  );
};

export default Book;

// string name;
// string author;
// uint year;
// bool finished;
