import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Book } from '../types';

interface ItemCardProps {
  item: Book;
  onPress: (item: Book) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item)}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.cardAuthor}>{item.author}</Text>
          <Text style={styles.cardYear}>{item.year}</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.cardGenre}>{item.genre}</Text>
          <Text style={styles.cardPrice}>${item.price.toLocaleString('es-CO')}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 16,
    gap: 4,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8b949e',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardAuthor: {
    fontSize: 13,
    color: '#61DAFB',
  },
  cardYear: {
    fontSize: 13,
    color: '#8b949e',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#30363d',
    paddingTop: 8,
  },
  cardGenre: {
    fontSize: 12,
    color: '#8b949e',
    backgroundColor: '#0d1117',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
