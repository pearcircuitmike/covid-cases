import React, { useState } from "react";
import Head from "next/head.js";
import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Text,
  Center,
  Heading,
  Container,
  GridItem,
  SimpleGrid,
  Grid,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Breadcrumb,
  BreadcrumbItem,
  Box,
  Stack,
} from "@chakra-ui/react";
import TwitterButton from "../components/social/TwitterButton";

import { ChevronRightIcon } from "@chakra-ui/icons";
import Chart from "chart.js/auto";

import Link from "next/link";

export const getStaticPaths = async () => {
  // csc api
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", process.env.NEXT_PUBLIC_CSC_API_KEY);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const url = "https://api.countrystatecity.in/v1/countries";

  const res = await fetch(url, requestOptions);
  const text = await res.text();
  const data = await JSON.parse(text);

  const paths = data.map((countryVal) => {
    return {
      params: { country: countryVal.iso2 },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const countryIso2 = context.params.country;

  // csc api
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", process.env.NEXT_PUBLIC_CSC_API_KEY);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const countryDetailsUrl = `https://api.countrystatecity.in/v1/countries/${countryIso2}`;
  const countryDetailsRes = await fetch(countryDetailsUrl, requestOptions);
  const countryDetailsText = await countryDetailsRes.text();
  const countryDetails = await JSON.parse(countryDetailsText);

  const countryDataUrl =
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/jhu/full_data.csv";

  const res = await fetch(countryDataUrl);
  const text = await res.text();
  const jsonArray = await csv().fromString(text);

  {
    /*const stateDataUrl = `https://api.countrystatecity.in/v1/countries/${countryIso2}/states`;

  const stateDataRes = await fetch(stateDataUrl, requestOptions);
  const stateDataText = await stateDataRes.text();
const stateDataDetails = await JSON.parse(stateDataText);*/
  }

  const filteredJsonArray = jsonArray.filter(
    (x) => x.location === countryDetails.name
  );

  return {
    props: {
      countryCaseData: filteredJsonArray,
      countryDetails: countryDetails,
      //states: stateDataDetails,
    },
  };
};

const CountryDetails = ({
  countryCaseData,
  countryDetails, //states
}) => {
  const filteredDates = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["date"];
      })
    )
  );
  const filteredTotalCases = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["total_cases"];
      })
    )
  );
  const filteredNewCases = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_cases"];
      })
    )
  );

  const filteredTotalDeaths = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["total_deaths"];
      })
    )
  );

  const filteredNewDeaths = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_deaths"];
      })
    )
  );

  const chartDataTotalCases = {
    labels: filteredDates,
    datasets: [
      {
        label: "Total Cases",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.cadmiumOrange,
        borderColor: colors.cadmiumOrange,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.cadmiumOrange,
        pointBackgroundColor: colors.cadmiumOrange,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.cadmiumOrange,
        pointHoverBorderColor: colors.cadmiumOrange,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredTotalCases,
      },
    ],
  };
  const chartDataNewCases = {
    labels: filteredDates,
    datasets: [
      {
        label: "New Cases",
        fill: true,
        lineTension: 0.1,
        backgroundColor: colors.yellowOrange,
        borderColor: colors.yellowOrange,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.yellowOrange,
        pointBackgroundColor: colors.yellowOrange,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.yellowOrange,
        pointHoverBorderColor: colors.yellowOrange,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,

        data: filteredNewCases,
      },
    ],
  };
  const chartDataTotalDeaths = {
    labels: filteredDates,
    datasets: [
      {
        label: "Total Deaths",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.kineticBlack,
        borderColor: colors.kineticBlack,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.kineticBlack,
        pointBackgroundColor: colors.kineticBlack,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.kineticBlack,
        pointHoverBorderColor: colors.kineticBlack,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredTotalDeaths,
      },
    ],
  };
  const chartDataNewDeaths = {
    labels: filteredDates,
    datasets: [
      {
        label: "New Deaths",
        fill: true,
        lineTension: 0.1,
        backgroundColor: colors.cadmiumOrange,
        borderColor: colors.cadmiumOrange,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.cadmiumOrange,
        pointBackgroundColor: colors.cadmiumOrange,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.cadmiumOrange,
        pointHoverBorderColor: colors.cadmiumOrange,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredNewDeaths,
      },
    ],
  };

  const [copied, setCopied] = useState(false);

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }
  const [countryName, setCountryName] = useState(
    countryDetails.name ? countryDetails.name : ""
  );
  const [countryNewCases, setCountryNewCases] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].new_cases
      : ""
  );
  const [countryNewDeaths, setCountryNewDeaths] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].new_deaths
      : "0"
  );

  const [countryTotalCases, setCountryTotalCases] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].total_cases
      : "0"
  );
  const [countryTotalDeaths, setCountryTotalDeaths] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].total_deaths
      : "0"
  );

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();
  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          Covid in {countryName} as of {currentMonth} {currentYear} | Covid
          Cases
        </title>
        <meta
          name="description"
          content={`Charting the ${countryName} Covid pandemic, with updated ${currentMonth} ${currentYear} case and death counts.`}
        />

        <meta
          property="og:title"
          content={`Covid in ${countryName} as of ${currentMonth} ${currentYear} | Covid Cases - Covid Deaths`}
        />
        <meta
          property="og:description"
          content={`Charting the ${countryName} Covid pandemic, with updated ${currentMonth} ${currentYear} case and death counts.`}
        />

        <meta property="og:url" content="https://covid-tracker.com/" />
        <meta
          property="og:image"
          content="https://covid-tracker.com/socialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`Charting the ${countryName} Covid pandemic, with updated ${currentMonth} ${currentYear} case and death counts.`}
        />
        <meta
          property="twitter:image"
          content="https://covid-tracker.com/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl" mt={35}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <Link href="/">
              <a>Home</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/countries">
              <a>Countries</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <a>{countryName}</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h1" size="4xl">
          {countryName} {countryDetails.emoji}
        </Heading>
        <Heading as="h2" size="md">
          Covid pandemic: Country Details
        </Heading>{" "}
        <StatGroup mt={5} mb={5}>
          <Stat>
            <StatLabel>Total Cases</StatLabel>
            <StatNumber>
              {countryTotalCases ? countryTotalCases.toLocaleString() : 0}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewCases ? countryNewCases.toLocaleString() : 0}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>New Deaths</StatLabel>
            <StatNumber>
              {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0}
            </StatHelpText>
          </Stat>
        </StatGroup>
        <Heading as="h2" mt={10} mb={5}>
          Covid in {countryName}: case counts, deaths, and statistics
        </Heading>
        <Text>
          Coronavirus disease 2019, or COVID-19, is a contagious disease caused
          by a virus, the severe acute respiratory syndrome coronavirus 2, or
          SARS-CoV-2. The first known case was identified in Wuhan, China, in
          December 2019. The disease quickly spread worldwide, resulting in the
          COVID-19 pandemic.
          <br /> <br />
        </Text>
        <Text>
          Symptoms of Covid are variable, but often include fever, cough,
          headache, fatigue, breathing difficulties, loss of smell, and loss of
          taste. Symptoms may begin one to fourteen days after exposure to the
          virus. At least a third of people who are infected do not develop
          noticeable symptoms. Of those people who develop symptoms noticeable
          enough to be classed as patients, most develop mild to moderate
          symptoms, up to mild pneumonia, while 14% develop severe symptoms,
          such as dyspnoea, hypoxia, or more than 50% lung involvement on
          imaging. About 5% develop critical symptoms, like respiratory failure,
          shock, or multiorgan dysfunction.
          <br />
          <br />
          Older people are at a higher risk of developing severe symptoms. Some
          people continue to experience a range of effects, called long COVID
          for months after recovery, and damage to organs has been observed.
          Multi-year studies are underway to further investigate the long-term
          effects of the disease.
          <br /> <br />
        </Text>
        <Text>
          This page shows data for the Covid virus currently circulating in{" "}
          {countryName}. This outbreak is part of the larger pandemic taking
          place in {countryDetails.region}, specifically in{" "}
          {countryDetails.subregion}.
          <br />
          <br />
        </Text>
        <Text>
          Based on the most recent reports available from the government in{" "}
          {countryDetails.capital}, health authorities in {countryName} have
          reported {countryNewCases.toLocaleString()} new case
          {countryNewCases == 1 ? `` : `s`} and{" "}
          {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0} new death
          {countryNewDeaths == 1 ? `` : `s`}. The people of {countryName} have
          experienced {countryTotalCases.toLocaleString()} total case
          {countryTotalCases == 1 ? `` : `s`} since the start of the pandemic.
          <br />
          <br />
          You can use the charts on this page to explore the spread of Covid in{" "}
          {countryName}. Lastly, you can see how the {countryName} Covid
          situation compares with the situation globally on the{" "}
          <Link href="/">
            <a style={{ color: `${colors.tenneTawny}` }}>
              covid-tracker.com homepage
            </a>
          </Link>
          .
        </Text>
        <Button onClick={copy} mt={5} mb={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>
        <TwitterButton />
        <SimpleGrid columns={[1, null, 2]}>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Total Covid Cases</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataTotalCases}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: New Covid Cases </Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataNewCases}
                  options={{ maintainAspectRatio: false, barThickness: 5 }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Covid Deaths</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataTotalDeaths}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: New Covid Deaths</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataNewDeaths}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
        </SimpleGrid>
        <Text mb={5} mt={10} color={"gray.500"}>
          Source:{" "}
          <a href={"https://ourworldindata.org/covid-cases"}>
            Our World In Data
          </a>
          . Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
        {/* <Heading mt={5} mb={5} as="h2" size="sm">
          View {countryName} situation by subregion
        </Heading>
        <SimpleGrid
          minChildWidth="100px"
          spacingX="40px"
          spacingY="15px"
          mb={5}
        >
          {states.map((state) => (
            <Box key={state.id}>
              <Link href={`/states/${countryDetails.iso2}_${state.iso2}`}>
                <a>
                  <Text noOfLines={1}>{state.name}</Text>
                </a>
              </Link>
            </Box>
          ))}
          </SimpleGrid>*/}
      </Container>
    </>
  );
};

export default CountryDetails;
