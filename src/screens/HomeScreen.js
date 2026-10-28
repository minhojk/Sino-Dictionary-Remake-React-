import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
            <Text style={styles.text}>
                Home
            </Text >

            <Text style={styles.text}>
                Single
            </Text>

            <Text style={styles.text}>
                Duo
            </Text>

            <Text style={styles.text}>
                Translate
            </Text>

            <Text style={styles.text}>
                Bookmarks
            </Text>

            <Text style={styles.text}>
                Quiz
            </Text>
        </View>

        <View>
            <Text style={styles.title}>
                Welcome  
            </Text>
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
                Quiz
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
  footer:{
    width:'100%',
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
});