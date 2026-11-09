import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Ionicons from '@react-native-vector-icons/ionicons';
export default function TranslationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topBar}>
          <Text style={styles.text} onPress={() => navigation.navigate('Home')}>
            Home
          </Text >

          <Text style={styles.text} onPress={() => navigation.navigate('SingleWord')}>
            Single
          </Text>

          <Text style={styles.text} onPress={() => navigation.navigate('DuoWord')}>
            Duo
          </Text>

          <Text style={styles.text} onPress={() => navigation.navigate('Translation')}>
            Translate
          </Text>

          <Text style={styles.text} onPress={() => navigation.navigate('Bookmarks')}>
            Bookmarks
          </Text>

          <Text style={styles.text} onPress={() => navigation.navigate('FlashCard')}>
            Flash Card
          </Text>

          <Text style={styles.text} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </View>

        <View style={styles.settings}>
          <Pressable onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={40} />
          </Pressable>
        </View>
      </View>

      <View style={styles.translationContent}>
        <Text style={styles.title}>
          Translation
        </Text>

        <View style={styles.content}>
          <View style={styles.translationBox}>
            <Text style={styles.boxLabel}>Lấy input từ user</Text>
            <TextInput
              accessibilityLabel="Input"
              multiline
              style={styles.input}
              textAlignVertical="top"
            />
          </View>

          <Pressable accessibilityLabel="Translate" style={styles.arrow}>
            →
          </Pressable>

          <View style={styles.translationBox}>
            <Text style={styles.boxLabel}>Nghĩa</Text>
            <View style={styles.output}>
              <Pressable style={styles.speaker} accessibilityLabel="Listen to pronunciation">
                🔊
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text styles={styles.footerTitle}>
            Sino Dictionary
          </Text>
          <Text styles={styles.footerDesc}>
            Test Text
          </Text>

          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>
              Home
            </Text >

            <Text style={styles.footerLink}>
              Single
            </Text>

            <Text style={styles.footerLink}>
              Duo
            </Text>

            <Text style={styles.footerLink}>
              Translate
            </Text>

            <Text style={styles.footerLink}>
              Bookmarks
            </Text>

            <Text style={styles.footerLink}>
              Flash Card
            </Text>
          </View>

          <Text style={styles.copyright}>
            @ 2026 Sino Dicitionary
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    marginTop: 20,
  },
  top: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  topBar: {
    position: 'absolute',
    left: '20%',
    width: '60%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
  },
  settings: {
    marginLeft: 'auto',
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#D9D9D9'
  },
  footerContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
  },
  footerDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#555555',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  footerLink: {
    marginRight: 20,
    marginTop: 8,
    fontSize: 14,
    color: '#333333',
  },
  copyright: {
    marginTop: 16,
    fontSize: 12,
    color: '#666666',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    padding: 50,
  },
  translationContent: {
    width: '100%',
    maxWidth: 1000,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  translationBox: {
    flex: 1,
    minHeight: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#222222',
    padding: 10,
  },
  boxLabel: {
    fontSize: 14,
    color: '#222222',
  },
  input: {
    flex: 1,
    padding: 1,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  arrow: {
    width: 40,
    textAlign: 'center',
    fontSize: 35,
    fontWeight: 100,
    color: '#111111',
  },
  output: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  speaker: {
    fontSize: 18,
  },
});
