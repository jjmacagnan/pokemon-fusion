import { styles } from "@/styles";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}>
      <Text style={styles.title}>Desculpator 3000</Text>
      <Text style={styles.subtitle}>Sua maquina de desculpas profissional</Text>
      <TextInput
        style={styles.input}
        placeholder="Escreva a proposta ..."
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.button_text}>Gerar desculpa infalível!</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.card_title}>Sua desculpa está pronta:</Text>
        <Text style={styles.card_text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem eveniet nostrum, facilis dignissimos nisi praesentium excepturi rem quas minima ullam eos cumque neque illum iste dolores enim! Provident, reprehenderit placeat?</Text>
      </View>
    </View>
  );
}
