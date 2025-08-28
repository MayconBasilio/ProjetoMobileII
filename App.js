import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, SafeAreaView, StatusBar, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
 
export default function App() {
  const [cep, setCep] = useState('');
  const [cepData, setCepData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const buscaCep = async (value) => {
    if (!value || value.length < 8) {
      alert('Por favor, digite um CEP válido');
      return;
    }
    
    setIsLoading(true);
    let url =  `https://viacep.com.br/ws/${value}/json/`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.erro) {
        alert('CEP não encontrado');
        setCepData(null);
      } else {
        setCepData(data);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setCepData(null);
      alert('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
        
        {/* Header Material Design */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>🔍 Buscador de CEP</Text>
            <Text style={styles.headerSubtitle}>Encontre endereços rapidamente</Text>
          </View>
          <View style={styles.headerBackground} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Input Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Digite o CEP</Text>
            <Text style={styles.cardDescription}>
              Insira o CEP no formato: 12345-678
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder='Ex: 12345-678'
              placeholderTextColor="#757575"
              keyboardType='numeric'
              onChangeText={(text) => {setCep(text)}}
              value={cep}
              maxLength={9}
              returnKeyType="done"
              onSubmitEditing={dismissKeyboard}
            />
            
            <View style={styles.buttonContainer}>
              <Pressable 
                style={({pressed}) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled
                ]}
                onPress={() => buscaCep(cep)}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? '🔍 Buscando...' : '🔍 Buscar CEP'}
                </Text>
              </Pressable>
              
              <Pressable 
                style={({pressed}) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={dismissKeyboard}
              >
                <Text style={styles.secondaryButtonText}>⌨️ Recolher</Text>
              </Pressable>
            </View>
          </View>

          {/* Results Card */}
          {cepData && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>📍 Endereço Encontrado</Text>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>✓ Válido</Text>
                </View>
              </View>
              
              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>CEP</Text>
                  <Text style={styles.resultValue}>{cepData.cep}</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Logradouro</Text>
                  <Text style={styles.resultValue}>{cepData.logradouro || 'N/A'}</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Bairro</Text>
                  <Text style={styles.resultValue}>{cepData.bairro || 'N/A'}</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Cidade</Text>
                  <Text style={styles.resultValue}>{cepData.localidade}</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Estado</Text>
                  <Text style={styles.resultValue}>{cepData.uf}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ℹ️ Sobre esta aplicação</Text>
            <Text style={styles.cardDescription}>
              Esta aplicação utiliza a API pública do ViaCEP para buscar informações de endereços brasileiros. 
              Os dados são fornecidos gratuitamente e podem ser utilizados para fins educacionais e comerciais.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by ViaCEP API</Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e8e8e8',
    opacity: 0.9,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    opacity: 0.1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    height: 55,
    borderColor: '#e0e0e0',
    borderWidth: 2,
    width: '100%',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonPressed: {
    transform: [{scale: 0.98}],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#757575',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  resultItem: {
    width: '48%',
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardBadge: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
 
 