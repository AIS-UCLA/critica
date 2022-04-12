import React from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { Async, AsyncProps } from 'react-async';
import update from 'immutability-helper';
import { Section, Loader, BrandedComponentProps } from '@innexgo/common-react-components';
import ErrorMessage from '../components/ErrorMessage';
import ExternalLayout from '../components/ExternalLayout';

import { ArticleData, ArticleSection, articleDataViewPublic, articleSectionViewPublic } from '../utils/api';
import { unwrap, getFirstOr } from '@innexgo/frontend-common';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import { useSearchParams } from 'react-router-dom'
import { animated, useSprings } from '@react-spring/web'

type ManageArticleSectionProps = {
  sections: ArticleSection[],
  position: number,
  mistakes: number,
  onFinish: (success: boolean) => void
};


function ManageArticleSection(props: ManageArticleSectionProps) {

  // select true sections and sort them
  let ordered_sections = props.sections.sort((a, b) => a.position - b.position);

  // select those sections with a smaller position
  let visible_ordered_sections = ordered_sections.filter(x => x.variant == 0).filter(x => x.position <= props.position);

  // select the possible selections for the next one
  let sectionOptions = ordered_sections
    .filter(x => x.position === props.position + 1)
    .sort((x, y) => x.sectionText.localeCompare(y.sectionText));

  let [optionMarks, setOptionMarks] = React.useState(new Array(sectionOptions.length).fill(false));

  const sectionOptionStyles = useSprings(
    sectionOptions.length,
    sectionOptions.map((s, i) =>
      s.variant === 0
        ? {
          pause: !optionMarks[i],
          from: { opacity: 1 },
          to: { opacity: 0 },
          onRest: () => {
            props.onFinish(true);
          }
        }
        : {
          pause: !optionMarks[i],
          config: {
            frequency: 0.1,
            damping: 0.1
          },
          from: { translateX: 0 },
          to: { translateX: 10 }
        }
    )
  )

  return <div>
    {visible_ordered_sections.map(x => <p key={x.articleSectionId}>{x.sectionText}</p>)}
    <div className="row">
      {sectionOptions.map((s, i) =>
        <animated.div style={sectionOptionStyles[i]} className="col-md p-3" key={i} >
          <Card className="w-100"
            border={
              optionMarks[i]
                ? s.variant === 0
                  ? "success"
                  : "danger"
                : undefined
            }
          >
            <Card.Body>
              <Card.Text>
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
                {s.sectionText}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setOptionMarks(update(optionMarks, { [i]: { $set: true } }))}
              >
                Choose
              </Button>
            </Card.Body>
          </Card>
        </animated.div>
      )}
    </div>
  </div>
}


type Data = {
  articleData: ArticleData,
  articleSection: ArticleSection[],
}

const loadData = async (props: AsyncProps<Data>) => {
  const articleData =
    await articleDataViewPublic({
      articleId: [props.articleId]
    })
      .then(unwrap)
      .then(x => getFirstOr(x, "NOT_FOUND"))
      .then(unwrap);

  const articleSection =
    await articleSectionViewPublic({
      articleId: [props.articleId]
    })
      .then(unwrap);

  return {
    articleData,
    articleSection
  }
}

function InnerArticleView(props: Data) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPosition = parseInt(searchParams.get("position") ?? "", 10) || 0;
  const [position, raw_setPosition] = React.useState(initialPosition);
  const setPosition = (n: number) => {
    setSearchParams(
      {
        articleId: props.articleData.article.articleId.toString(),
        position: n.toString(),
      },
      {
        replace: true
      }
    );
    raw_setPosition(n);
  }

  const [sectionData, setSectionData] = React.useState(
    props.articleSection.map(s => ({ section: s, viewed: false }))
  );

  return <Section id="article" name={d.articleData.title}>
    <ManageArticleSection
      sectionData={s}
    position={position}
    onFinish={success => {
      setPosition(position + 1);
      if (!success) {
        setMistakes(mistakes + 1)
      }
    }}
              />
  </Section>

}



function ArticleView(props: BrandedComponentProps) {
  const [searchParams, _] = useSearchParams();
  const articleId = parseInt(searchParams.get("articleId") ?? "", 10);

  return <ExternalLayout branding={props.branding} fixed={false} transparentTop={true}>
    <Container className="py-4">
      <Async promiseFn={loadData} articleId={articleId}>
        {({ setData }) => <>
          <Async.Pending><Loader /></Async.Pending>
          <Async.Rejected>
            {e => <ErrorMessage error={e} />}
          </Async.Rejected>
          <Async.Fulfilled<Data>>{d => <InnerArticleView {...d} />} </Async.Fulfilled>
        </>}
      </Async>
    </Container>
  </ExternalLayout>
}

export default ArticleView;
