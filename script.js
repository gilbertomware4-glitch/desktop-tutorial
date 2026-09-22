const storageKey = 'incheck-talk-demo-v1';
const savedState = JSON.parse(localStorage.getItem(storageKey) || '{"saved":[],"liked":[]}');
const discussions = JSON.parse(localStorage.getItem(`${storageKey}-discussions`) || '{}');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function persist() { localStorage.setItem(storageKey, JSON.stringify(savedState)); }
function persistDiscussions() { localStorage.setItem(`${storageKey}-discussions`, JSON.stringify(discussions)); }

const discussionModal = document.querySelector('#discussionModal');
const discussionTitle = document.querySelector('#discussionTitle');
const discussionList = document.querySelector('#discussionList');
let activeStoryId = '';
function renderDiscussion() {
  const ideas = discussions[activeStoryId] || [];
  discussionList.replaceChildren();
  if (!ideas.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-discussion';
    emptyMessage.textContent = 'Be the first person to share an idea.';
    discussionList.append(emptyMessage);
    return;
  }
  ideas.forEach((idea) => {
    const item = document.createElement('p');
    const name = document.createElement('strong');
    const text = document.createElement('span');
    name.textContent = idea.name;
    text.textContent = idea.text;
    item.append(name, text);
    discussionList.append(item);
  });
}
function openDiscussion(card) {
  activeStoryId = card.dataset.id;
  discussionTitle.textContent = card.querySelector('h3').textContent;
  renderDiscussion();
  discussionModal.hidden = false;
  document.querySelector('#ideaInput').focus();
}
document.querySelectorAll('.workflow-card').forEach((card) => {
  const discussionButton = document.createElement('button');
  discussionButton.className = 'discussion-button';
  discussionButton.type = 'button';
  discussionButton.textContent = `Talk ${discussions[card.dataset.id]?.length || 0}`;
  discussionButton.addEventListener('click', () => openDiscussion(card));
  card.querySelector('.card-footer').append(discussionButton);
});
document.querySelector('#discussionClose').addEventListener('click', () => { discussionModal.hidden = true; });
discussionModal.addEventListener('click', (event) => { if (event.target === discussionModal) discussionModal.hidden = true; });
document.querySelector('#discussionForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#ideaInput');
  if (!discussions[activeStoryId]) discussions[activeStoryId] = [];
  discussions[activeStoryId].push({ name: 'Gilbert', text: input.value.trim() });
  persistDiscussions();
  renderDiscussion();
  input.value = '';
  showToast('Your idea was added to the conversation');
});

document.querySelectorAll('.filter').forEach((filter) => {
  filter.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((button) => button.classList.remove('active'));
    filter.classList.add('active');
    const category = filter.dataset.filter;
    document.querySelectorAll('.workflow-card').forEach((card) => {
      card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
    });
  });
});

const searchPanel = document.querySelector('#searchPanel');
const searchInput = document.querySelector('#workflowSearch');
const searchStatus = document.querySelector('#searchStatus');
function updateSearch() {
  const query = searchInput.value.trim().toLowerCase();
  let matches = 0;
  document.querySelectorAll('.workflow-card').forEach((card) => {
    const searchableText = card.textContent.toLowerCase();
    const visible = !query || searchableText.includes(query);
    card.classList.toggle('hidden', !visible);
    if (visible) matches += 1;
  });
  searchStatus.textContent = query ? `${matches} stor${matches === 1 ? 'y' : 'ies'} found` : 'Search all published stories.';
}
document.querySelector('#searchToggle').addEventListener('click', () => {
  searchPanel.hidden = false;
  searchInput.focus();
});
document.querySelector('#searchClose').addEventListener('click', () => {
  searchInput.value = '';
  updateSearch();
  searchPanel.hidden = true;
});
searchInput.addEventListener('input', updateSearch);

document.querySelectorAll('.save-button').forEach((button) => {
  const card = button.closest('.workflow-card');
  if (savedState.saved.includes(card.dataset.id)) button.classList.add('saved');
  button.addEventListener('click', () => {
    const id = card.dataset.id;
    const isSaved = savedState.saved.includes(id);
    savedState.saved = isSaved ? savedState.saved.filter((item) => item !== id) : [...savedState.saved, id];
    button.classList.toggle('saved', !isSaved);
    persist();
    showToast(isSaved ? 'Removed from your studio' : 'Saved to your story library');
  });
});

document.querySelectorAll('.workflow-card').forEach((card) => {
  const like = card.querySelector('.like-count');
  card.querySelector('.card-footer > span:first-child').addEventListener('click', () => {
    const id = card.dataset.id;
    if (savedState.liked.includes(id)) return showToast('You already liked this workflow');
    savedState.liked.push(id);
    like.textContent = `${Number(like.textContent.replace('k', '')) + (like.textContent.includes('k') ? 0.1 : 1)}${like.textContent.includes('k') ? 'k' : ''}`;
    persist();
    showToast('Story liked');
  });
  card.querySelector('.follow-button').addEventListener('click', (event) => {
    event.target.textContent = event.target.textContent === 'Follow' ? 'Following' : 'Follow';
    showToast(event.target.textContent === 'Following' ? 'Creator added to your feed' : 'Creator removed');
  });
});

const modal = document.querySelector('#modalBackdrop');
function openModal() { modal.hidden = false; document.querySelector('#modalClose').focus(); }
function closeModal() { modal.hidden = true; }
document.querySelector('#joinButton').addEventListener('click', openModal);
const creatorModal = document.querySelector('#creatorModal');
document.querySelector('#creatorButton').addEventListener('click', () => { creatorModal.hidden = false; document.querySelector('#workflowTitle').focus(); });
document.querySelector('#creatorClose').addEventListener('click', () => { creatorModal.hidden = true; });
creatorModal.addEventListener('click', (event) => { if (event.target === creatorModal) creatorModal.hidden = true; });
document.querySelector('#creatorForm').addEventListener('submit', (event) => { event.preventDefault(); creatorModal.hidden = true; event.target.reset(); showToast('Story draft saved for review'); });
document.querySelector('.avatar').addEventListener('click', () => document.querySelector('#owner').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.querySelector('#confirmJoin').addEventListener('click', () => { closeModal(); showToast('Checkout is ready for your payment integration'); });
document.querySelector('#loadMore').addEventListener('click', (event) => { event.target.innerHTML = 'You are all caught up <span>✓</span>'; showToast('More stories are being curated'); });
