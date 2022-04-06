use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use strum::AsRefStr;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleNewProps {
  pub title: String,
  pub duration_estimate: Option<i64>,
  pub api_key: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleDataNewProps {
  pub article_id: i64,
  pub title: String,
  pub duration_estimate: Option<i64>,
  pub active: bool,
  pub api_key: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleSectionNewProps {
  pub article_id: i64,
  pub position: i64,
  pub end_time: i64,
  pub correct: bool,
  pub active: bool,
  pub api_key: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleViewProps {
  pub article_id: Option<Vec<i64>>,
  pub min_creation_time: Option<i64>,
  pub max_creation_time: Option<i64>,
  pub creator_user_id: Option<Vec<i64>>,
  pub api_key: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleDataViewProps {
  pub article_data_id: Option<Vec<i64>>,
  pub min_creation_time: Option<i64>,
  pub max_creation_time: Option<i64>,
  pub creator_user_id: Option<Vec<i64>>,
  pub article_id: Option<Vec<i64>>,
  pub name: Option<Vec<String>>,
  pub min_duration_estimate: Option<i64>,
  pub max_duration_estimate: Option<i64>,
  pub concrete: Option<bool>,
  pub time_utility_function_id: Option<Vec<i64>>,
  pub status: Option<Vec<ArticleDataStatusKind>>,
  pub only_recent: bool,
  pub scheduled: Option<bool>,
  pub api_key: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleSectionViewProps {
  pub article_section_id: Option<Vec<i64>>,
  pub min_creation_time: Option<i64>,
  pub max_creation_time: Option<i64>,
  pub creator_user_id: Option<Vec<i64>>,
  pub article_id: Option<Vec<i64>>,
  pub min_start_time: Option<i64>,
  pub max_start_time: Option<i64>,
  pub min_end_time: Option<i64>,
  pub max_end_time: Option<i64>,
  pub active: Option<bool>,
  pub only_recent: bool,
  pub api_key: String,
}

