import { generatorExecuse } from "@/services/ia/generator";
import { styles } from "@/styles";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [excuse, setExcuse] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setLoading] = useState(false)


  const handlePress = async () => {

    if (excuse.length < 5) {
      alert("Mensagem muito curta!")
      return;
    }

    setLoading(true)
    setAnswer('')
    const result = await generatorExecuse(excuse);
    setAnswer(result || "...");
    setLoading(false);
  }

  return (
    <View
      style={styles.container}>
      <Text style={styles.title}>Desculpator 3000</Text>
      <Text style={styles.subtitle}>Sua maquina de desculpas profissional</Text>
      <TextInput
        value={excuse}
        onChangeText={setExcuse}
        style={styles.input}
        placeholder="Escreva a proposta ..."
      />
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.button_text}>{isLoading ? "Carregando ..." : "Gerar desculpa infalível!"}</Text>
      </TouchableOpacity>

      {answer && <View style={styles.card}>
        <Text style={styles.card_title}>Sua desculpa está pronta:</Text>
        <Text style={styles.card_text}>{answer}</Text>
      </View>}
    </View>
  );
}
