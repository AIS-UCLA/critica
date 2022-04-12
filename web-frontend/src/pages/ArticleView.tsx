import React from 'react';
import { Row, Col, Container, Card } from 'react-bootstrap';
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

type ManageArticleSectionProps = {
  sections: ArticleSection[],
  position: number,
  setPosition: (a: number) => void
};


function ManageArticleSection(props: ManageArticleSectionProps) {
  // select true sections and sort them
  let ordered_sections = props.sections.sort((a, b) => a.position - b.position);

  // select those sections with a smaller position
  let visible_ordered_sections = ordered_sections.filter(x => x.variant == 0).filter(x => x.position <= props.position);

  // select the possible selections for the next one
  let possible_new_sections = ordered_sections.filter(x => x.position === props.position + 1);

  return <div>
    {visible_ordered_sections.map(x => <p key={x.articleSectionId}>{x.sectionText}</p>)}
    <div className="d-flex flex-wrap">
      {possible_new_sections.map(s =>
        <Card
          key={s.articleSectionId}
          style={{ width: '15rem' }}
          className="m-2"
          onClick={() => {
            if (s.variant == 0) {
              props.setPosition(props.position + 1)
            }
          }}>
          <Card.Body>
            <Card.Text>{s.sectionText}</Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  </div>
}

function ArticleView(props: BrandedComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const articleId = parseInt(searchParams.get("articleId") ?? "", 10);
  const initialPosition = parseInt(searchParams.get("position") ?? "", 10) || 0;
  const [position, raw_setPosition] = React.useState(initialPosition);
  const setPosition = (n: number) => {
    setSearchParams(
      {
        articleId: articleId.toString(),
        position: n.toString(),
      },
      {
        replace: true
      }
    );
    raw_setPosition(n);
  }

  return <ExternalLayout branding={props.branding} fixed={false} transparentTop={true}>
    <Container className="py-4">
      <Async promiseFn={loadData} articleId={articleId}>
        {({ setData }) => <>
          <Async.Pending><Loader /></Async.Pending>
          <Async.Rejected>
            {e => <ErrorMessage error={e} />}
          </Async.Rejected>
          <Async.Fulfilled<Data>>{d =>
            <Section id="article" name={d.articleData.title}>
              <ManageArticleSection
                sections={d.articleSection}
                position={position}
                setPosition={setPosition}
              />
            </Section>
          }
          </Async.Fulfilled>
        </>}
      </Async>
    </Container>
  </ExternalLayout>
}

export default ArticleView;
