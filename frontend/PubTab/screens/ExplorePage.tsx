import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import {ACCENT_COLOR_1, ACCENT_COLOR_2, PRIMARY_COLOR, PURPLE, SERVER_URL} from "../constants.ts";
import { useEffect } from 'react';
import { Card } from 'react-native-paper';

interface Pub {
  name: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
}

const ExplorePage = () => {
  const [pubList, setPubList] = useState<Pub[]>([]);

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/pubs`);
        const data = await response.json();
        setPubList(data);
      } catch (error) {
        console.error('Error fetching pub list:', error);
      }
    };

    fetchPubs();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {pubList.map((pub, index) => (
          <Card key={index} style={styles.pub}>
            <Card.Title titleStyle={styles.pubTitleText} subtitleStyle={styles.pubText} title={pub.name} subtitle={`${pub.address}, ${pub.city}, ${pub.province}, ${pub.zip}`}/>
            <Card.Content>
              <View>
                <Text style={styles.pubText}>Phone: {pub.phone}</Text>
                <Text style={styles.pubText}>Email: {pub.email}</Text>
                <Text 
                  style={[styles.pubText, { color: '#0066CC' }]} 
                  onPress={() => Linking.openURL(pub.website)}
                >
                  {pub.website}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
  },
  pub: {
    marginVertical: 5,
    width: '95%',
    backgroundColor: ACCENT_COLOR_1,
    borderRadius: 15,
  },
  pubText: {
    color: ACCENT_COLOR_2,
    fontSize: 16,
    fontFamily: 'Sf Pro Display',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  pubTitleText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 0, // Reduce the margin bottom to decrease padding
    color: ACCENT_COLOR_2,
    fontFamily: 'Playfair Display',
  },
});

export default ExplorePage;