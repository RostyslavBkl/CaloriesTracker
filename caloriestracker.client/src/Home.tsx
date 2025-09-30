import AuthorizeView from "./authorization/AuthorizeView";

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