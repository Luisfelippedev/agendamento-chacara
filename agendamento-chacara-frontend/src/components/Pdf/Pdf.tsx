import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export interface IContractTemplateProps {
  fullName: string;
  phoneNumber: string;
  cpf: string;
  entryTime: string;
  departureTime: string;
  numberOfBusyDays: string;
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
      <View style={styles.section}>
        <Text>{fullName}</Text>
        <Text>{phoneNumber}</Text>
        <Text>{cpf}</Text>
        <Text>{departureTime}</Text>
        <Text>{entryTime}</Text>
        <Text>{numberOfBusyDays}</Text>
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
          {childComponent}
        </PDFDownloadLink>
      </div>
    </>
  );
}
