import AuthorizeView from "../authorization/AuthorizeView";
import '../index.css';


const Home = () => {
  return (
    <AuthorizeView>
      <div>
        <span> Home page </span>
      </div>
    </AuthorizeView>
  );
}

export default Home;