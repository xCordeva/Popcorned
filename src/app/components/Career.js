import PersonsWork from "./PersonsWork";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

export default function Career({ id, type, works, personDetails }) {
  console.log(works);
  console.log(personDetails);

  return (
    <div className="person-career">
      <h1>{personDetails.name}'s Career</h1>
      <div className="works">
        <Accordion
          allowMultipleExpanded={true}
          allowZeroExpanded={false}
          preExpanded={"a"}
        >
          {works.find(
            (work) => work.department === "Directing" || work.job === "Director"
          ) && (
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Directing</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {works.map(
                  (work) =>
                    (work.department === "Directing" ||
                      work.job === "Director") && (
                      <PersonsWork work={work} key={work.id} />
                    )
                )}
              </AccordionItemPanel>
            </AccordionItem>
          )}

          {works.find(
            (work) => work.department === "Writing" || work.job === "Writer"
          ) && (
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>Writing</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {works.map(
                  (work) =>
                    (work.department === "Writing" ||
                      work.job === "Writer") && (
                      <PersonsWork work={work} key={work.id} />
                    )
                )}
              </AccordionItemPanel>
            </AccordionItem>
          )}

          {works.find((work) => !work.department) && (
            <AccordionItem uuid="a">
              <AccordionItemHeading>
                <AccordionItemButton>Acting</AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {works.map(
                  (work) =>
                    !work.department && (
                      <PersonsWork work={work} key={work.id} />
                    )
                )}
              </AccordionItemPanel>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
}
