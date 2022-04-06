use serde::{Deserialize, Serialize};
use strum::AsRefStr;

use super::request;

#[derive(Clone, Debug, Serialize, Deserialize, AsRefStr)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum FakeJournalReaderError {
  NoCapability,
  ArticleNonexistent,
  ArticleSectionNonexistent,
  NegativeDuration,
  DecodeError,
  InternalServerError,
  MethodNotAllowed,
  Unauthorized,
  BadRequest,
  NotFound,
  Network,
  Unknown,
}

impl std::fmt::Display for FakeJournalReaderError {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    write!(f, "{}", self.as_ref())
  }
}

impl std::error::Error for FakeJournalReaderError {}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Goal {
  pub goal_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeUtilityFunction {
  pub time_utility_function_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub start_times: Vec<i64>,
  pub utils: Vec<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalData {
  pub goal_data_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub goal: Goal,
  pub name: String,
  pub duration_estimate: Option<i64>,
  pub time_utility_function: TimeUtilityFunction,
  pub status: request::GoalDataStatusKind,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalEvent {
  pub goal_event_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub goal: Goal,
  pub start_time: i64,
  pub end_time: i64,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserGeneratedCode {
  pub user_generated_code_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub source_code: String,
  pub source_lang: String,
  pub wasm_cache: Vec<u8>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalTemplate {
  pub goal_template_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalTemplateData {
  pub goal_template_data_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub goal_template: GoalTemplate,
  pub name: String,
  pub utility: i64,
  pub user_generated_code: UserGeneratedCode,
  pub duration_estimate: Option<i64>,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalTemplatePattern {
  pub goal_template_pattern_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub goal_template: GoalTemplate,
  pub pattern: String,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalDependency {
  pub goal_dependency_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub goal: Goal,
  pub dependent_goal: Goal,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalEntityTag {
  pub goal_entity_tag_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub named_entity: NamedEntity,
  pub goal: Goal,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NamedEntity {
  pub named_entity_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NamedEntityData {
  pub named_entity_data_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub named_entity: NamedEntity,
  pub name: String,
  pub kind: request::NamedEntityKind,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NamedEntityPattern {
  pub named_entity_pattern_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub named_entity: NamedEntity,
  pub pattern: String,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalEvent {
  pub external_event_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalEventData {
  pub external_event_data_id: i64,
  pub creation_time: i64,
  pub creator_user_id: i64,
  pub external_event: ExternalEvent,
  pub name: String,
  pub start_time: i64,
  pub end_time: i64,
  pub active: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Info {
  pub service: String,
  pub version_major: i64,
  pub version_minor: i64,
  pub version_rev: i64,
}
