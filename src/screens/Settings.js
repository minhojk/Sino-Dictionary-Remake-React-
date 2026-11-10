import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SettingScreen({ navigation }) {
    const [selectedLanguage, setSelectedLanguage] = useState();

    return (
        <View style={styles.container}>
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

            <View style={styles.body}>
                <Text style={styles.title}>
                    Settings
                </Text>

                <View style={styles.content}>
                    <View style={styles.settingLine}>
                        <Text style={styles.settingText}>
                            Language
                        </Text>

                        <Picker
                            style={styles.picker}
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedLanguage(itemValue)
                            }>
                            <Picker.Item label="English" value="eng" />
                            <Picker.Item label="Vietnamese" value="vn" />
                        </Picker>
                    </View>

                    <View style={styles.settingLine}>
                        <Text style={styles.settingText}>
                            Theme
                        </Text>

                        <Picker
                            style={styles.picker}
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedLanguage(itemValue)
                            }>
                            <Picker.Item label="Light" value="light" />
                            <Picker.Item label="Dark" value="dark" />
                        </Picker>
                    </View>

                    <View style={styles.settingLine}>
                        <Text style={styles.settingText}>
                            Font Style
                        </Text>

                        <Picker
                            style={styles.picker}
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedLanguage(itemValue)
                            }>
                            <Picker.Item label="Arial" value="arial" />
                            <Picker.Item label="Times New Roman" value="tnr" />
                        </Picker>
                    </View>

                    <View style={styles.feedbacks}>
                        <Pressable>
                            <Text style={styles.reportText}>
                                Report bugs
                            </Text>
                        </Pressable>

                        <Pressable>
                            <Text style={styles.feedbacksText}>
                                Give feedbacks
                            </Text>
                        </Pressable>

                        <Pressable>
                            <Text style={styles.feedbacksText}>
                                About
                            </Text>
                        </Pressable>
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
    body: {
        width: '100%',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 560,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    settingLine: {
        marginBottom: 14,
    },
    settingText: {
        marginBottom: 4,
        fontSize: 20,
    },
    picker: {
        width: '100%',
        height: 50,
    },
    feedbacks: {
        marginTop: 12,
    },
    reportText: {
        paddingVertical: 6,
        fontSize: 20,
    },
    feedbacksText: {
        paddingVertical: 6,
        fontSize: 20,
    },
});