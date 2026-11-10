import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function FlipCard() {
    const progress = useSharedValue(0);

    const frontStyle = useAnimatedStyle(() => ({
        transform: [
            {
                 perspective: 1000
            },
            {
                rotateY: `${progress.value * 180}deg`
            }
        ]
    }));

    const backStyle = useAnimatedStyle(() => ({
        transform: [
            {
                 perspective: 1000
            },
            {
                rotateY: `${180 + progress.value * 180}deg`
            }
        ]
    }));

    const flipCard = () => {
        progress.value = withTiming(progress.value === 0 ? 1 : 0, {
            duration: 600
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.cardArea}>
                <Animated.View style={[styles.card, frontStyle]}>
                    <Text>
                        Front
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.card, styles.back, backStyle]}>
                    <Text>
                        Back
                    </Text>
                </Animated.View>

                <Pressable onPress={flipCard} style={styles.button}>
                    <Text>
                        Flip
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardArea: {
        width: 200,
    },
    card: {
        width: 200,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dddddd',
        backfaceVisibility: 'hidden',
    },
    back: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#cceeff'
    },
    button: {
        width: 50,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        padding: 10,
        backgroundColor: '#dddddd',
    }
})
