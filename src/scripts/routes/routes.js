import HomePage from '../pages/home/home-page';
import RegisterPage from '../pages/register/register-page';
import SavedPage from '../pages/saved/saved-page';
import LoginPage from '../pages/login/login-page';
import StoryPage from '../pages/story/story-page';
import AddStoryPage from '../pages/addstory/addstory-page';

const routes = {
  '/': new HomePage(),
  '/saved': new SavedPage(),
  '/register': new RegisterPage(),
  '/login': new LoginPage(),
  '/stories/:id': new StoryPage(),
  '/addstory': new AddStoryPage(),
};

export default routes;
