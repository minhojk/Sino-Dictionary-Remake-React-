import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import HomeScreen from '../screens/HomeScreen';
import DuoWordScreen from '../screens/DuoWord';
import SingleWordScreen from '../screens/SingleWord';
import QuizScreen from '../screens/Quiz';
import TranslationScreen from '../screens/Translation';
import BookmarkScreen from '../screens/Bookmarks'

const Stack = createNativeStackNavigator();

export default function ScreensNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        <Stack.Screen name="SingleWord" component={SingleWordScreen} options={{ title: 'Single Words' }} />
        <Stack.Screen name="DuoWord" component={DuoWordScreen} options={{ title: 'Duo Words' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
        <Stack.Screen name="Translation" component={TranslationScreen} options={{ title: 'Translation' }} />
        <Stack.Screen name="Bookmarks" component={BookmarkScreen} options={{ title: 'Bookmarks' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}