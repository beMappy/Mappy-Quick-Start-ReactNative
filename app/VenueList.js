import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// VenueListItem component
const VenueListItem = ({ venue }) => {
    const navigation = useNavigation();

    // Handle opening the map for the selected venue
    const handleOpenMap = (venue) => {
        navigation.navigate('Map', { venue });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{venue.data.name}</Text>
            <Text style={styles.description}>{venue.data.description}</Text>
            <TouchableOpacity onPress={() => handleOpenMap(venue)} style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Open Map</Text>
            </TouchableOpacity>
        </View>
    );
};

// VenueList component
const VenueList = ({ venues }) => {
    return (
        <View style={styles.container}>
            {venues.map((venue) => (
                <VenueListItem key={venue.venueId} venue={venue} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    description: {
        fontSize: 14,
        marginBottom: 8,
        color: '#666',
    },
    buttonContainer: {
        backgroundColor: '#007AFF',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default VenueList;
