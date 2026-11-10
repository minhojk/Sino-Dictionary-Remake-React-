import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, Pressable } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const initialWords = [
  { id: '1', kanji: '学生', meaning: 'học sinh' },
  { id: '2', kanji: '学校', meaning: 'trường học' },
  { id: '3', kanji: '先生', meaning: 'giáo viên' },
  { id: '4', kanji: '日本', meaning: 'Nhật Bản' },
  { id: '5', kanji: '中国', meaning: 'Trung Quốc' },
  { id: '6', kanji: '電話', meaning: 'điện thoại' },
  { id: '7', kanji: '時間', meaning: 'thời gian' },
  { id: '8', kanji: '食物', meaning: 'thức ăn' },
];

export default function BookmarkScreen({ navigation }) {
  const [words, setWords] = useState(initialWords);

  const removeBookmark = (id) => {
    setWords((currentWords) => currentWords.filter((word) => word.id !== id));
  };

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

      <View style={styles.searchBar}>
        <TextInput placeholder='Search' style={styles.searchInput} />
      </View>

      <View style={styles.body}>
        <Text style={styles.bodyTitle}>Bookmarks</Text>
        <View style={styles.list}>
          <FlatList
            data={words}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={[styles.row, index % 2 === 1 && styles.alternateRow]}>
                <View style={styles.wordDetails}>
                  <Text style={styles.kanji}>
                    {item.kanji}
                  </Text>

                  <Text style={styles.meaning}>
                    {item.meaning}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.kanji} from bookmarks`}
                  onPress={() => removeBookmark(item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>No bookmarked words.</Text>
            }
          />
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
  body: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  list: {
    flex: 1,
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderRadius: 15,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  alternateRow: {
    backgroundColor: '#F8F8F8',
  },
  wordDetails: {
    flex: 1,
    paddingVertical: 10,
  },
  kanji: {
    color: '#222222',
    fontSize: 18,
  },
  meaning: {
    marginTop: 3,
    color: '#555555',
    fontSize: 14,
  },
  removeButton: {
    minHeight: 40,
    justifyContent: 'center',
    marginLeft: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F6E8E5',
  },
  removeText: {
    color: '#9B3D32',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMessage: {
    paddingVertical: 24,
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  bodyTitle: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
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
  searchBar: {
    flex: 1,
    padding: 16
  },
  searchInput: {
    width: 500,
    height: '4%',
    flexDirection: 'row',
    marginTop: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderColor: 'black',
  }
});