import React, { useState } from "react"; 
import { post } from 'axios'; 
import {useNavigate} from "react-router-dom";  //changed

function ArticleAdd(props) {
  const navigate = useNavigate();
  const initialState = { title: '', content: '' }
  const [article, setArticle] = useState(initialState) 

  function handleChange(event) { 
    setArticle({...article, [event.target.name]: event.target.value})
  }

  function handleSubmit(event) { 
    event.preventDefault();     
    if(!article.title || !article.content ) return 
    async function postArticle() {
      try {
        const response = await post('/api/articles', article);
        console.log(props.history);
        navigate(`/articles/${response.data._id}`);  //changed
      } catch(error) {
        console.log('error', error);
      }
    }
    postArticle();
  }

  function handleCancel() {
    props.history.push("/articles");
  }

  return ( 
    <div>
      <h1>Create Article</h1>
      <hr/>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input name="title" type="text" value={article.title} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea name="content" rows="5" value={article.content} onChange={handleChange} className="form-control" />
        </div>
        <div className="btn-group">
          <input type="submit" value="Submit" className="btn btn-primary" />
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ArticleAdd;