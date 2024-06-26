import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
// import assinaturaImg from "../../../public/assinatura.png";

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
  totalValue: string;
  departureTime: string;
  entryTime: string;
  numberOfBusyDays: string;
  date: any;
  additionalServices: Array<any>;
}

const styles = StyleSheet.create({
  page: {
    padding: 80,
    paddingBottom: 15,
    paddingTop: 70,
    fontFamily: "Roboto",
    fontWeight: "normal",
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
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "bold",
  },
  regular: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "normal",
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
  sectionTwoText: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
  },
  image: {
    width: "100%", // Ajuste conforme necessário
    height: "auto", // Ajuste conforme necessário
    objectFit: "contain", // Manter a proporção da imagem
  },
});

// Create Document Component
export const ContractTemplate = ({
  fullName,
  phoneNumber,
  cpf,
  departureTime,
  totalValue,
  numberOfBusyDays,
  date,
  entryTime,
  additionalServices,
}: IContractTemplateProps) => {
  function dateToDateWithBar(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function dateToString(date: any) {
    const data = dayjs(date).locale("pt-br"); // Parse da string de data e configuração do local
    const formattedDate = data.format("DD-MM-YYYY"); // Formato desejado
    return formattedDate;
  }

  function adicionarUmDia(dataString: any) {
    // Dividir a string da data em dia, mês e ano
    const [dia, mes, ano] = dataString.split("-").map(Number);

    // Criar um objeto de data usando o construtor Date
    const data = new Date(ano, mes - 1, dia);

    // Adicionar um dia à data
    data.setDate(data.getDate() + 1);

    // Obter o novo dia, mês e ano da data
    const novoDia = data.getDate();
    const novoMes = data.getMonth() + 1;
    const novoAno = data.getFullYear();

    // Formatar a nova data para o formato dd/mm/yyyy
    const novaDataFormatada = `${novoDia.toString().padStart(2, "0")}-${novoMes
      .toString()
      .padStart(2, "0")}-${novoAno}`;

    return novaDataFormatada;
  }

  function calculateEndDate(): string {
    let untilTheDate = dateToString(date);
    if (Number(numberOfBusyDays) > 1) {
      for (let i = 1; i < Number(numberOfBusyDays); i++) {
        untilTheDate = adicionarUmDia(untilTheDate);
      }
    }
    return untilTheDate.replace(/-/g, "/");
  }

  const getDateFullString = () => {
    if (Number(numberOfBusyDays) > 1) {
      return `do dia ${dateToDateWithBar(
        date
      )}, entrando as ${entryTime} horas, até o dia ${calculateEndDate()}, saindo as ${departureTime} horas, para o fim de realizar atividades de lazer.`;
    }
    return `no dia ${dateToDateWithBar(
      date
    )}, no horário das ${entryTime} até as ${departureTime} para o fim de realizar atividades de lazer.`;
  };

  function getTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // O mês é baseado em zero, então adicionamos 1
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function isNextDay() {
    // Divide as strings de entrada e saída no formato "HH:MM"
    const [entryHours, entryMinutes] = entryTime.split(":").map(Number);
    const [departureHours, departureMinutes] = departureTime
      .split(":")
      .map(Number);

    // Crie objetos Date para os horários de entrada e saída
    const entryDate = new Date();
    entryDate.setHours(entryHours, entryMinutes, 0, 0);

    const departureDate = new Date();
    departureDate.setHours(departureHours, departureMinutes, 0, 0);

    // Verifique se o horário de saída é antes do horário de entrada, indicando que é no dia seguinte
    if (departureDate <= entryDate) {
      let dateValue = dateToString(date);
      dateValue = adicionarUmDia(dateValue);
      return dateValue.replace(/-/g, "/");
    }
    return dateToDateWithBar(date);
  }

  function getFinishScheduleString() {
    if (Number(numberOfBusyDays) > 1) {
      return `até às ${departureTime}h do dia de ${calculateEndDate()}`;
    }
    return `até às ${departureTime}h do dia de ${isNextDay()}`;
  }

  const createServiceString = () => {
    if (additionalServices.length > 0) {
      return additionalServices
        .map((service) => service.serviceName)
        .join(", ");
    }

    return null;
  };

  const assinaturaImg = "/assinatura.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBox}>
          <Text style={{ textAlign: "center" }}>
            CONTRATO DE LOCAÇÃO DA CHÁCARA DO DANDÃO
          </Text>
        </View>
        <View style={styles.section}>
          {/* <Text>{fullName}</Text>
          <Text>{phoneNumber}</Text>
          <Text>{cpf}</Text>
          <Text>{departureTime}</Text>
          <Text>{totalValue}</Text>
          <Text>{numberOfBusyDays}</Text>
          <Text>{entryTime}</Text>
          <Text>{String(date)}</Text> */}
          {/* <Text>{createServiceString()}</Text> */}
          {/* 
          {additionalServices.map((item, index) => (
            <Text key={index}>{item.serviceName}</Text>
          ))} */}
          <View style={{ marginBottom: 10 }}>
            <View style={styles.sectionTwoText}>
              <Text style={styles.bold}>LOCADORA:</Text>
              <Text style={styles.regular}>
                CHÁCARA DO DANDÃO, estabelecida na PB-366. – Cidade São José
              </Text>
            </View>
            <View style={styles.sectionTwoText}>
              <Text style={styles.regular}>
                de Piranhas, Estado da Paraíba, neste ato representada por seu
                proprietário Sr.º DAMOCLES MENDES DE HOLANDA, brasileiro,
                casado, portador do documento RG nº {process.env.OWNER_RG}{" "}
                SPTC/GO e CPF nº {process.env.OWNER_CPF}, simplesmente
                denominada “LOCADORA”:
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 10, gap: 1 }}>
            <Text style={styles.regular}>E do outro lado:</Text>
            <View style={styles.sectionTwoText}>
              <Text style={styles.bold}>LOCATÁRIO(A):</Text>
              <Text style={styles.regular}>{fullName},</Text>
            </View>
            <View style={styles.sectionTwoText}>
              <Text style={styles.bold}>Cpf:</Text>
              <Text style={styles.regular}>{cpf},</Text>
            </View>
            <View style={styles.sectionTwoText}>
              <Text style={styles.regular}>portador(a) do documento </Text>
              <Text style={styles.bold}>OBJETO: </Text>
              <Text style={styles.regular}>Locação da </Text>
              <Text style={styles.bold}>Chácara do Dandão.</Text>
            </View>
          </View>

          <Text style={styles.paragraph}>
            Pelo presente instrumento particular, e na melhor forma de direito,
            as partes acima nomeadas têm entre si, certo e ajustado o presente
            contrato, que se regerá pelas seguintes cláusulas e condições que
            mutuamente aceitam, a saber:
          </Text>

          <View style={styles.section}>
            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>1)</Text>
                <Text style={styles.regular}> A </Text>
                <Text style={styles.bold}>CHÁCARA DO DANDÃO </Text>
                <Text style={styles.regular}>
                  destina-se exclusivamente a atividades de cunho
                </Text>
              </View>
              <Text style={styles.listItem}>familiar, social e cultural.</Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>2)</Text>
                <Text style={styles.regular}>
                  Desde já, o(a) Locatário(a) fica ciente de que a capacidade
                  máxima do espaço é
                </Text>
              </View>
              <Text style={styles.listItem}>
                de 400 (quatrocentos) pessoas.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>3)</Text>
                <Text style={styles.regular}>
                  A locadora cede ao locatário o espaço identificado no objeto
                  do presente, para ser
                </Text>
              </View>
              <Text style={styles.listItem}>
                utilizado {getDateFullString()}
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>4)</Text>
                <Text style={styles.regular}>
                  Constitui-se objeto deste contrato a locação da área coberta,
                  banheiros masculino
                </Text>
              </View>
              <Text style={styles.listItem}>
                e feminino, área da cozinha, área da piscina, para realização do
                evento acima descrito. Com os seguintes itens: 1 TV com controle
                remoto, 1 aparelho de DVD Philco com controle remoto, 1 aparelho
                de som Philips com duas caixas de 40W, 1 freezer horizontal 2
                portas (240 litros), 1 fogão industrial 2 bocas (Dako), 1
                botijão de gás, 4 banquetas de madeira, 2 grelhas para
                churrasco.
              </Text>
            </View>
            {/* <View style={{ marginTop: 40 }} /> */}
            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>5)</Text>
                <Text style={styles.regular}>
                  Ficará a cargo do(a) LOCATÁRIO(a) providenciar o suprimento do
                  material que irá
                </Text>
              </View>
              <Text style={styles.listItem}>
                consumir no evento, tais como: talheres, toalhas de papel, papel
                higiênico, sabão, material de cozinha, etc. em quantidade
                suficientes e compatíveis com suas necessidades e com a
                estrutura das instalações.
              </Text>
            </View>

            <View style={styles.sectionTwoText}>
              <Text style={styles.bold}>6)</Text>
              <Text style={styles.regular}>
                Fica estipulado o valor da locação de R$: {totalValue}
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>PARÁGRAFO PRIMEIRO:</Text>
                <Text style={styles.regular}>
                  Quando da assinatura do presente contrato o(a)
                </Text>
              </View>
              <Text style={styles.listItem}>
                Locatário(a), obrigatoriamente efetuará o pagamento de 50%
                (cinqüenta por cento) do valor da locação:
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>PARÁGRAFO SEGUNDO:</Text>
                <Text style={styles.regular}>
                  Antes de iniciar o evento o(a) locatário(a) deverá pagar
                </Text>
              </View>
              <Text style={styles.listItem}>
                o valor restante, equivalente a 50%(cinqüenta por cento) do
                valor total.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>PARÁGRAFO TERCEIRO:</Text>
                <Text style={styles.regular}>
                  Caso haja desistência por parte do(a) Locatário(a),
                </Text>
              </View>
              <Text style={styles.listItem}>
                50% (cinqüenta por cento) do valor pago relativo à locação não
                será devolvido.
              </Text>
            </View>

            <View>
              <View style={{ marginTop: 50 }} />
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>7)</Text>
                <Text style={styles.regular}>
                  É de responsabilidade do(a) Locatário(a) o recolhimento dos
                  encargos referentes
                </Text>
              </View>
              <Text style={styles.listItem}>
                a Direitos Autorais, pelo cumprimento do horário noturno - lei
                do silêncio, legalmente estipulado para uso de música ao vivo ou
                mecânica, durante a realização do evento.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>8)</Text>
                <Text style={styles.regular}>
                  Os danos causados ao patrimônio serão reparados em comum
                  acordo com a
                </Text>
              </View>
              <Text style={styles.listItem}>
                Locadora, correndo a despesa por conta do(a) Locatário(a).
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>9)</Text>
                <Text style={styles.regular}>
                  É de responsabilidade do(a) Locatário(a) pela contratação de
                  serviço de segu-
                </Text>
              </View>
              <Text style={styles.listItem}>
                rança a ser utilizada no local, e demais obrigações com
                mão-de-obra empregadas no respectivo evento, bem como do
                controle de acesso de convidados ao evento.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>10)</Text>
                <Text style={styles.regular}>
                  A Locadora não se responsabiliza pelos atos e danos praticados
                  pelo(a)
                </Text>
              </View>
              <Text style={styles.listItem}>
                Locatário(a) e convidados, inclusive acidentes ocorridos nas
                áreas interna e externa.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>11)</Text>
                <Text style={styles.regular}>
                  Não será permitida, para sustentação de balões, faixas,
                  cartazes e painéis,
                </Text>
              </View>
              <Text style={styles.listItem}>
                a colocação de pregos, parafusos e outros objetos que danifiquem
                a pintura das paredes, teto, colunas do espaço.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>12)</Text>
                <Text style={styles.regular}>
                  Após o horário definido para término do evento o(a)
                  Locatário(a) se compromete
                </Text>
              </View>
              <Text style={styles.listItem}>
                a devolver o espaço nas condições de asseio e manutenção já
                descritas neste contrato, impreterivelmente{" "}
                {getFinishScheduleString()}, nas mesmas condições como foi
                recebido.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>PARÁGRAFO ÚNICO:</Text>
                <Text style={styles.regular}>
                  Caso a devolução do espaço não ocorra na forma estipulada
                </Text>
              </View>
              <Text style={styles.listItem}>
                nesta cláusula por atitudes do(a) Locatário(a), este deverá
                imediatamente ressarcir financeiramente ao Locador o possível
                dano causado nas instalações físicas, asseio e manutenção, e
                ainda, prejuízos decorrentes pela extrapolação do horário limite
                do evento. Neste caso será cobrado multa no valor de R$ 50,00
                por hora e/ou fração.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>13)</Text>
                <Text style={styles.regular}>
                  A Locadora não se responsabiliza pelo extravio ou danos a
                  quaisquer objetos
                </Text>
              </View>
              <Text style={styles.listItem}>
                deixados pelo(a) Locatário(a) nas dependências e imediações do
                espaço, antes, durante e após o evento.
              </Text>
            </View>

            <View>
              <View style={styles.sectionTwoText}>
                <Text style={styles.bold}>14)</Text>
                <Text style={styles.regular}>
                  O LOCATÁRIO se responsabiliza integralmente por qualquer tipo
                  de taxa,
                </Text>
              </View>
              <Text style={styles.listItem}>
                multa ou penalidade que venha a ser imposta por órgãos de
                fiscalização ou judiciais, seja na esfera municipal, estadual ou
                federal, decorrente da utilização da chácara objeto deste
                contrato. Além do mais, O LOCATÁRIO compromete-se a arcar com
                todos os custos e encargos relacionados a tais penalidades,
                isentando completamente o LOCADOR de qualquer responsabilidade
                ou obrigação financeira que possa surgir em decorrência dessas
                infrações. Caso o LOCADOR venha a ser notificado ou cobrado por
                tais penalidades, o LOCATÁRIO se obriga a reembolsar prontamente
                o LOCADOR por quaisquer valores pagos ou despesas incorridas.
                Esta cláusula permanece válida e eficaz mesmo após o término do
                período de locação, abrangendo todas as infrações ocorridas
                durante a vigência do contrato.
              </Text>
            </View>

            {createServiceString() !== null && (
              <View>
                <View style={styles.sectionTwoText}>
                  <Text style={styles.bold}>15)</Text>
                  <Text style={styles.regular}>
                    O locatário terá direito aos seguintes serviços:
                  </Text>
                </View>
                <Text style={styles.listItem}>{createServiceString()}.</Text>
              </View>
            )}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 30,
              marginTop: 40,
            }}
          >
            <View
              style={{
                display: "flex",
                gap: 25,
              }}
            >
              <View
                style={{
                  display: "flex",
                  gap: 20,
                  marginTop: 0,
                }}
              >
                <Text>São José de Piranhas {getTodayDate()} </Text>

                <Text style={{ marginTop: 116 }}>
                  _______________________________________
                </Text>
                <Text>Locatário(a)</Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 5,
                display: "flex",
                gap: 0,
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image style={styles.image} src={assinaturaImg} />
              <View
                style={{
                  display: "flex",
                  gap: 20,
                }}
              >
                <Text>_______________________________________</Text>
                <View
                  style={{
                    display: "flex",
                    gap: 5,
                  }}
                >
                  <Text>Locadora</Text>
                  <Text>Endereço: São José de Piranhas, PB-366</Text>
                  <Text>Telefone: (83) 99192-1727</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

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
    totalValue,
    fullName,
    numberOfBusyDays,
    phoneNumber,
    date,
    entryTime,
    additionalServices,
  } = data;

  function getFirstAndSecondName(string: any) {
    // Divide a string em um array de palavras
    const nameParts = string.trim().split(/\s+/);

    // Pega o primeiro e o segundo nome, se existirem
    const firstName = nameParts[0] || "";
    const secondName = nameParts[1] || "";

    // Retorna a junção do primeiro e segundo nome
    return `${firstName} ${secondName}`.trim();
  }

  return (
    <>
      <div>
        <PDFDownloadLink
          document={
            <ContractTemplate
              additionalServices={additionalServices}
              cpf={cpf}
              departureTime={departureTime}
              totalValue={totalValue}
              fullName={fullName}
              numberOfBusyDays={numberOfBusyDays}
              phoneNumber={phoneNumber}
              date={date}
              entryTime={entryTime}
            />
          }
          fileName={getFirstAndSecondName(fullName)}
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
