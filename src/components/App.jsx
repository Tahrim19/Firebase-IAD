import { useEffect, useState } from "react";
import Nav from "./Nav";
import Article from "./Article";
import ArticleEntry from "./ArticleEntry";
import { fetchArticles, createArticle } from "../services/articleService";
import "./style.css";
import { useAuthentication } from "../services/authService";
import { Signin, SignOut } from "./Auth";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [writing, setWriting] = useState(null);
  const user = useAuthentication();
  useEffect(() => {
    if (user) {
      fetchArticles().then(setArticles);
    }
  }, [user]);
  function addArticle({ title, body }) {
    createArticle({ title, body }).then((article) => {
      setArticle(article);
      setArticles([article, ...articles]);
      setWriting(false);
    });
  }
  function handleUpdateArticle(updated) {
    // Update the article in state
    setArticles((prevArticles) =>
      prevArticles.map((a) => (a.id === updated.id ? updated : a))
    );
    setArticle(updated); // Update the selected article too
  }

  function handleDeleteArticle(deletedId) {
    setArticles((prevArticles) =>
      prevArticles.filter((a) => a.id !== deletedId)
    );
    setArticle(null); // Clear selected article
  }

  return (
    // <div className="App">
    //     <header>
    //         Blog
    //         {user && <button onClick={() => setWriting(true)}>New Article</button>}
    //         {!user ? <Signin /> : <SignOut />}
    //     </header>

    //     {!user ? "" : < Nav articles={articles} setArticle={setArticle}/>}
    //     {!user ? (
    //         ""
    //     ) : writing ? (
    //         <ArticleEntry addArticle={addArticle} />
    //     ) : (
    //         <Article article={article}
    //         onUpdate={handleUpdateArticle}
    //         onDelete={handleDeleteArticle} />

    //     )}
    // </div>
    <div className="App">
      <header>
        Blog
        {user && <button onClick={() => setWriting(true)}>New Article</button>}
        {!user ? <Signin /> : <SignOut />}
      </header>

      {/* {user && (
        <div>
          <Nav articles={articles} setArticle={setArticle} />
          {writing ? (
            <ArticleEntry addArticle={addArticle} />
          ) : (
            <Article
              article={article}
              onUpdate={handleUpdateArticle}
              onDelete={handleDeleteArticle}
            />
          )}
        </div>
      )} */}
      {user && (
        <div>
          <Nav articles={articles} setArticle={setArticle} />
          {writing ? (
            <ArticleEntry addArticle={addArticle} />
          ) : article ? (
            <Article
              article={article}
              onUpdate={handleUpdateArticle}
              onDelete={handleDeleteArticle}
            />
          ) : (
            <div className="article-list">
              {articles.map((a) => (
                <div
                  key={a.id}
                  className="article-card"
                  onClick={() => setArticle(a)}
                >
                  <h3>{a.title}</h3>
                  <p>{a.body.split(" ").slice(0, 15).join(" ")}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
