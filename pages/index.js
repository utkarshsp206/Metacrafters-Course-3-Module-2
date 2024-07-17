import { useState, useEffect } from "react";
import { ethers } from "ethers";
import library_abi from "../artifacts/contracts/Assessment.sol/Library.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [library, setLibrary] = useState(undefined);
  const [bookCount, setBookCount] = useState(undefined);
  const [books, setBooks] = useState([]);
  const [showAvailableBooks, setShowAvailableBooks] = useState(false);


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const libraryABI = library_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  }

  const handleShowAvailableBooks = () => {
    console.log("Hndle show avaiable books");
    setShowAvailableBooks(true);
    console.log(showAvailableBooks);
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getLibraryContract();
  };

  const getLibraryContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const libraryContract = new ethers.Contract(contractAddress, libraryABI, signer);

    setLibrary(libraryContract);
  }

  const getBookCount = async () => {
    if (library) {
      setBookCount((await library.getBookCount()).toNumber());
    }
  }

  const getBooks = async () => {
    if (library) {
      const bookCount = await getBookCount();
      const booksArray = [];
      for (let i = 1; i <= bookCount; i++) {
        const [title, author, isAvailable] = await library.getBook(i);
        booksArray.push({ id: i, title, author, isAvailable });
      }
      setBooks(booksArray);
    }
  }

  const handleAddBook = (title, author) => {
    console.log("HandleaddBook clicked");
    return { title, author };
  };
  
  const handleAddBookClick = async () => {
    const titleInput = document.getElementById("title-input");
    const authorInput = document.getElementById("author-input");
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    console.log("HandleaddBookClick clicked");
  
    if (title && author) {
      const book = handleAddBook(title, author);
      await addBook(book.title, book.author);
      titleInput.value = "";
      authorInput.value = "";
    }
  };
  const handleAddBookClickReturn = async () => {
    const titleInput = document.getElementById("title-input");
    const authorInput = document.getElementById("author-input");
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    console.log("HandleaddBookClick clicked");
  
    if (title && author) {
      const book = handleAddBook(title, author);
      await addBookReturn(book.title, book.author);
      titleInput.value = "";
      authorInput.value = "";
    }
  };
  
  const addBook = async (title, author) => {
    try {
      await library.addBook(title, author);
      setBooks((prevBooks) => [...prevBooks, { title, author }]);
      console.log("Inside try addBook clicked");
      getBookCount();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };
  const addBookReturn = async (title, author) => {
    try {
      await library.addBook(title, author);
      setBooks((prevBooks) => [...prevBooks, { title, author }]);
      console.log("Inside try addBook clicked");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const borrowBook = (title) => {
    setBooks(books.filter((book) => book.title !== title));
  };
  
  const returnBook = async (id) => {
    try {
      await library.returnBook(id);
      getBooks(); // Call getBooks to update the books state
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };


  console.log(books);

  const disconnectAccount = async () => {
    setAccount(undefined);
  }

const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this library.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", marginLeft: "10px" }}>Connect Your Metamask wallet</button>
    }

    if (bookCount == undefined) {
      getBookCount();
    }

   return (
  <div>
    <h1>Welcome to Utkarsh's Library</h1>
    <p>Your Account: {account}</p>
    <p>Book Count: {bookCount}</p>
    <ul>

{books.map((book) => (
  <li key={`${book.id}-${book.title}-${book.author}`}>
    {book.title} by {book.author}
    <button onClick={() => borrowBook(book.title)} style={{ backgroundColor: "#4CAF50", marginRight:"5px",color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Borrow</button>

      
  </li>
))}
</ul>
    <button onClick={handleShowAvailableBooks} style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Show Available Books</button>
    {console.log("Show Available books")}
    {showAvailableBooks && (
    
      <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title} by {book.author}</li>
      ))}
    </ul>
    )}
    <input id="title-input" type="text" placeholder="Title" />
    <input id="author-input" type="text" placeholder="Author" />
    <button onClick={handleAddBookClick} style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Add Book</button>
    <button onClick={handleAddBookClickReturn} style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Return Book</button>
    <button onClick={disconnectAccount} style={{ backgroundColor: "#ff0000", color: "#fff", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Disconnect Account</button>
  </div>
)}

  useEffect(() => { getWallet(); }, []);

  return (
    <>
      <nav style={{ display: "flex", flexDirection: "column", backgroundColor: "#333", padding: "10px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.5)" }}>
        <label class="logo" style={{ fontWeight: "bold", fontSize: "20px", color: "#fff", marginBottom: "20px", justifyContent: "center" }}>Utkarsh's Library</label>
        <ul style={{ listStyle: "none", padding: "0", margin: "0", display: "flex", justifyContent: "space-between" }}>
          <li style={{ flexBasis: "20%" }}><a class="active" href="#" style={{ textDecoration: "none", color: "#fff", backgroundColor: "#444", padding: "10px 20px", borderRadius: "10px" }}>Home</a></li>
          <li style={{ flexBasis: "20%" }}><a href="#" style={{ textDecoration: "none", color: "#fff", padding: "10px 20px", borderRadius: "10px" }}>About</a></li>
          <li style={{ flexBasis: "20%" }}><a href="#" style={{ textDecoration: "none", color: "#fff", padding: "10px 20px", borderRadius: "10px" }}>Services</a></li>
          <li style={{ flexBasis: "20%" }}><a href="#" style={{ textDecoration: "none", color: "#fff", padding: "10px 20px", borderRadius: "10px" }}>Contact</a></li>
          <li style={{ flexBasis: "20%" }}><a href="#" style={{ textDecoration: "none", color: "#fff", padding: "10px 20px", borderRadius: "10px" }}>Feedback</a></li>
        </ul>
      </nav>
      <main className="container" style={{ backgroundColor: "rgb(211 193 133)", minHeight: "85vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* <h1>Welcome to Utkarsh's Library</h1> */}
        {initUser()}
        <style jsx>{`
         .container {
            text-align: center
          },
        `}
        </style>
      </main>
    </>)}