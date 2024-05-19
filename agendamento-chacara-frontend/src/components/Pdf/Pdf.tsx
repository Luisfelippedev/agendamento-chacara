import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/roboto-v30-latin-900.ttf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "/fonts/roboto-v30-latin-regular.ttf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
  ],
});

export interface IContractTemplateProps {
  fullName: string;
  phoneNumber: string;
  cpf: string;
  entryTime: string;
  departureTime: string;
  numberOfBusyDays: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 80,
    fontFamily: "Roboto",
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
    display: "flex",
    gap: 5,
  },
  bold: {
    fontSize: 12,
    fontWeight: "bold",
  },
  regular: {
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.2, // Adjust the line height as needed
  },
  listItem: {
    marginBottom: 5,
    lineHeight: 1.2, // Adjust the line height as needed
  },
  headerBox: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    border: "1px solid black",
    padding: 5,
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

interface MyComponentProps {
  style?: Record<string, any>;
  moreStyles?: Record<string, any>;
}


// Create Document Component
const ContractTemplate = ({
  fullName,
  phoneNumber,
  cpf,
  departureTime,
  entryTime,
  numberOfBusyDays,
}: IContractTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <Text style={{ textAlign: "center" }}>
          CONTRATO DE LOCAÇÃO DO ESPAÇO SILVEIRA
        </Text>
      </View>
      <View style={styles.section}>
        {/* <Text>{fullName}</Text>
        <Text>{phoneNumber}</Text>
        <Text>{cpf}</Text>
        <Text>{departureTime}</Text>
        <Text>{entryTime}</Text>
        <Text>{numberOfBusyDays}</Text> */}
        <View style={styles.section}>
          <Text>
            <Text style={styles.bold}>LOCADORA:</Text>{" "}
            <Text>
              ESPAÇO SILVEIRA, estabelecida na Rua Viriato Correia Qd.09 Lt.09.
              – Cidade Satélite São Luiz, Aparecida de Goiânia, Estado de Goiás,
              neste ato representada por sua proprietária Sr.ª CECÍLIA SILVEIRA
              DO NASCIMENTO, brasileira, casada, portador do documento RG nº
              823647 SPTC/GO e CPF nº 151.947.841-72, simplesmente denominada
              “LOCADORA”.
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>LOCATÁRIO(A):</Text>
          <Text>___________________________________________________</Text>
          <Text>
            CPF: ______________________________ portador(a) do documento
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>OBJETO:</Text>
          <Text>Locação do Espaço Silveira.</Text>
        </View>

        <Text style={styles.paragraph}>
          Pelo presente instrumento particular, e na melhor forma de direito, as
          partes acima nomeadas têm entre si, certo e ajustado o presente
          contrato, que se regerá pelas seguintes cláusulas e condições que
          mutuamente aceitam, a saber:
        </Text>

        <View style={styles.section}>
          <Text style={styles.listItem}>
            1) O ESPAÇO SILVEIRA destina-se exclusivamente a atividades de cunho
            familiar, social e cultural. Não será admitida a realização de
            eventos com acesso livre ao público, com finalidade lucrativa.
          </Text>
          <Text style={styles.listItem}>
            2) Desde já, o(a) Locatário(a) fica ciente de que a capacidade
            máxima do espaço é de 150 (cento e cinqüenta) pessoas.
          </Text>
          <Text style={styles.listItem}>
            3) A locadora cede ao locatário o espaço identificado no objeto do
            presente, para ser utilizado no dia _____/_____/______, no horário
            das __________________, para o fim de realizar
            ________________________________________________
          </Text>
          <Text style={styles.listItem}>
            4) Constitui-se objeto deste contrato a locação da área coberta,
            banheiros masculino e feminino, área da cozinha, área da piscina,
            para realização do evento acima descrito. Com os seguintes itens: 1
            TV 29’ Samsung com controle remoto, 1 aparelho de DVD Philco com
            controle remoto, 1 aparelho de som Philips com duas caixas de 40W, 1
            freezer horizontal 2 portas (240 litros), 1 fogão industrial 2 bocas
            (Dako), 1 botijão de gás, 4 banquetas de madeira, 2 grelhas para
            churrasco. ___________ cadeiras plásticas, ____________ mesas
            plásticas.
          </Text>
          <Text style={styles.listItem}>
            5) Ficará a cargo do(a) LOCATÁRIO(a) providenciar o suprimento do
            material que irá consumir no evento, tais como: talheres, toalhas de
            papel, papel higiênico, sabão, material de cozinha, etc. em
            quantidade suficientes e compatíveis com suas necessidades e com a
            estrutura das instalações.
          </Text>
          <Text style={styles.listItem}>
            6) Fica estipulado o valor da locação de R$:
            _____________________________.
          </Text>
          <Text style={styles.listItem}>
            PARÁGRAFO PRIMEIRO: Quando da assinatura do presente contrato o(a)
            Locatário(a), obrigatoriamente efetuará o pagamento de 50%
            (cinqüenta por cento) do valor da locação:
          </Text>
          <Text style={styles.listItem}>
            PARÁGRAFO SEGUNDO: Antes de iniciar o evento o(a) locatário(a)
            deverá pagar o valor restante, equivalente a 50%(cinqüenta por
            cento) do valor total.
          </Text>
          <Text style={styles.listItem}>
            PARÁGRAFO TERCEIRO: Caso haja desistência por parte do(a)
            Locatário(a), 50% (cinqüenta por cento) do valor pago relativo à
            locação não será devolvido.
          </Text>
          <Text style={styles.listItem}>
            7) É de responsabilidade do(a) Locatário(a) o recolhimento dos
            encargos referentes a Direitos Autorais, pelo cumprimento do horário
            noturno - lei do silêncio, legalmente estipulado para uso de música
            ao vivo ou mecânica, durante a realização do evento.
          </Text>
          <Text style={styles.listItem}>
            PARÁGRAFO ÚNICO: Não será permitido som automotivo no local, o
            volume do som diurno (das 07:00 as 22:00 horas) não poderá
            ultrapassar os 50 decibéis, e em horário noturno (das 22:00 das
            07:00 horas) não poderá ultrapassar os 30 decibéis.
          </Text>
          <Text style={styles.listItem}>
            8) Os danos causados ao patrimônio serão reparados em comum acordo
            com a Locadora, correndo a despesa por conta do(a) Locatário(a).
          </Text>
          <Text style={styles.listItem}>
            9) É de responsabilidade do(a) Locatário(a) pela contratação de
            serviço de segurança a ser utilizada no local, e demais obrigações
            com mão-de-obra empregadas no respectivo evento, bem como do
            controle de acesso de convidados ao evento.
          </Text>
          <Text style={styles.listItem}>
            10) A Locadora não se responsabiliza pelos atos e danos praticados
            pelo(a) Locatário(a) e convidados, inclusive acidentes ocorridos nas
            áreas interna e externa.
          </Text>
          <Text style={styles.listItem}>
            11) Não será permitida, para sustentação de balões, faixas, cartazes
            e painéis, a colocação de pregos, parafusos e outros objetos que
            danifiquem a pintura das paredes, teto, colunas do espaço.
          </Text>
          <Text style={styles.listItem}>
            12) Após o horário definido para término do evento o(a) Locatário(a)
            se compromete a devolver o espaço nas condições de asseio e
            manutenção já descritas neste contrato, impreterivelmente até às
            09:00h do dia seguinte, nas mesmas condições como foi recebido.
          </Text>
          <Text style={styles.listItem}>
            PARÁGRAFO ÚNICO: Caso a devolução do espaço não ocorra na forma
            estipulada nesta cláusula por atitudes do(a) Locatário(a), este
            deverá imediatamente ressarcir financeiramente ao Locador o possível
            dano causado nas instalações físicas, asseio e manutenção, e ainda,
            prejuízos decorrentes pela extrapolação do horário limite do evento.
            Neste caso será cobrado multa no valor de R$ 50,00 por hora e/ou
            fração.
          </Text>
          <Text style={styles.listItem}>
            13) A Locadora não se responsabiliza pelo extravio ou danos a
            quaisquer objetos deixados pelo(a) Locatário(a) nas dependências e
            imediações do espaço, antes, durante e após o evento.
          </Text>
        </View>

        <View style={styles.section}>
          <Text>Aparecida de Goiânia _____/_____/______</Text>
          <Text>____________________________</Text>
          <Text>Locatário(a)</Text>
          <Text>____________________________</Text>
          <Text>Locadora</Text>
        </View>

        <View style={styles.section}>
          <Text>
            Endereço:_________________________________________________________
          </Text>
          <Text>Telefone: ____________________________________</Text>
        </View>
      </View>
    </Page>
  </Document>
);

interface IReportGeneratorProps {
  childComponent: React.ReactNode; // Tipo do filho como React.ReactNode
  data: IContractTemplateProps;
}

export default function ContractGenerator({
  childComponent,
  data,
}: IReportGeneratorProps) {
  const {
    cpf,
    departureTime,
    entryTime,
    fullName,
    numberOfBusyDays,
    phoneNumber,
  } = data;

  // const handleClickButton = async (blob: any) => {
  //   const render = new FileReader();
  //   render.readAsDataURL(blob);
  //   render.onloadend = () => {
  //     console.log(render.result);
  //   };
  // };

  return (
    <>
      <div>
        <PDFDownloadLink
          document={
            <ContractTemplate
              cpf={cpf}
              departureTime={departureTime}
              entryTime={entryTime}
              fullName={fullName}
              numberOfBusyDays={numberOfBusyDays}
              phoneNumber={phoneNumber}
            />
          }
          fileName="report.pdf"
        >
          {/* {({ blob, url, loading, error }) => {
  !loading && handleClickButton(blob);
  return loading ? "Loading document..." : "Download now!";
}} */}
          {childComponent}
        </PDFDownloadLink>
      </div>
    </>
  );
}
