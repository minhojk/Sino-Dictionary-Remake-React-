import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
            <Text>
                Home
            </Text>

            <Text>
                Single
            </Text>

            <Text>
                Duo
            </Text>

            <Text>
                Translate
            </Text>

            <Text>
                Bookmarks
            </Text>

            <Text>
                Quiz
            </Text>
        </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topBar: {
    width: '60%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
  },
});