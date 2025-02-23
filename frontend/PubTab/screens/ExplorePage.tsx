import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { ACCENT_COLOR_1, ACCENT_COLOR_2, PRIMARY_COLOR, SERVER_URL } from '../constants';
import { Card, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Pub {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  image: string | null;
}

const getTab = async () => {
  try {
    const token = await AsyncStorage.getItem('tab');
    if (token !== null) {
      console.log('Tab:', token);
      return token;
    } else {
      console.log('No tab found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving tab:', error);
    return null;
  }
};

const ExplorePage = ({ setSelectedPub, tabInitialized }: { setSelectedPub: any, tabInitialized: boolean }) => {
  const [pubList, setPubList] = useState<Pub[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPubs, setFilteredPubs] = useState<Pub[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);


  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/pubs`);
        const data = await response.json();
        setPubList(data);
        setFilteredPubs(data);
      } catch (error) {
        console.error('Error fetching pub list:', error);
      }
    };
    fetchPubs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPubs(pubList);
    } else {
      setFilteredPubs(
        pubList.filter(pub =>
          pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pub.city.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, pubList]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Pubs..."
        placeholderTextColor={ACCENT_COLOR_2}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {filteredPubs.map((pub, index) => (
          <Card key={index} style={styles.pub}>
            <TouchableOpacity onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}>
              {pub.image && (
                <Image
                  source={{ uri: `${SERVER_URL}/media/${pub.image}` }}
                  style={styles.pubImage}
                />
              )}
              <Card.Title
                titleStyle={styles.pubTitleText}
                subtitleStyle={styles.pubText}
                title={pub.name}
                subtitle={`${pub.address}, ${pub.city}, ${pub.province}, ${pub.zip}`}
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <Card.Content>
                <Text style={styles.pubText}>{pub.phone}</Text>
                <Text style={styles.pubText}>{pub.email}</Text>
                <Text
                  style={[styles.pubText, { color: '#0066CC' }]}
                  onPress={() => Linking.openURL(pub.website)}
                >
                  {pub.website}
                </Text>

                {!tabInitialized && (
                  <Card.Actions>
                  <Button icon="currency-eur" onPress={() => {
                    setSelectedPub(pub.id);
                  }} color={ACCENT_COLOR_2}>
                    Start a Tab
                  </Button>
                  </Card.Actions>
                )}
              </Card.Content>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
  },
  searchBar: {
    height: 40,
    width: '95%',
    backgroundColor: ACCENT_COLOR_1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: ACCENT_COLOR_2,
    fontSize: 16,
    marginBottom: 10,
  },
  pub: {
    marginVertical: 5,
    width: '95%',
    backgroundColor: ACCENT_COLOR_1,
    borderRadius: 15,
    padding: 10,
  },
  pubImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  pubText: {
    color: ACCENT_COLOR_2,
    fontSize: 16,
    fontFamily: 'Sf Pro Display',
  },
  pubTitleText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: ACCENT_COLOR_2,
    fontFamily: 'Playfair Display',
  },
});

export default ExplorePage;